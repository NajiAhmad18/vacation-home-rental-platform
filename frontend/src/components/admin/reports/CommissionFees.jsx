// src/pages/reports/CommissionFees.jsx
import React, { useEffect, useMemo } from "react";
import { DollarSign, Percent, CalendarDays, TrendingUp } from "lucide-react";
import { usePaymentStore } from "../../../stores/usePaymentStore"; // ← path fix

// Policy: commission is always 10% of gross (amount)
const COMMISSION_RATE = 0.10;
const COMMISSION_LABEL = `${(COMMISSION_RATE * 100).toFixed(0)}%`;

// Fallbacks (align with backend defaults in LKR)
const FALLBACK_FEES = Object.freeze({ cleaning: 0, service: 0, taxes: 0 });

const toArray = (x) => (Array.isArray(x) ? x : x?.items ?? []);
const money = (n, ccy = "LKR") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(Number(n || 0));

const toUTCMidnight = (d) => {
  const x = new Date(d);
  return Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
};
const nightsBetween = (ci, co) => {
  const ms = toUTCMidnight(co) - toUTCMidnight(ci);
  return ms > 0 ? Math.round(ms / 86400000) : 0;
};
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/** Normalize a payment row:
 * - currency, baseAmount (nightly revenue), serviceFee
 * - commission: ALWAYS 10% of gross (amount)
 */
function normalizePayment(p) {
  const booking = p.booking || p.bookingId || {};
  const home = p.home || p.homeId || {};
  const currency = (p.currency || booking.currency || "LKR").toUpperCase();

  // Gross captured amount
  const total = Number(p.amount ?? booking.totalPrice ?? 0);

  // Prefer server-persisted fees; fall back to booking fees; else to 0
  const cleaningFee =
    Number.isFinite(p.cleaningFee) ? Number(p.cleaningFee)
    : Number.isFinite(booking.feeCleaning) ? Number(booking.feeCleaning)
    : FALLBACK_FEES.cleaning;

  const serviceFee =
    Number.isFinite(p.serviceFee) ? Number(p.serviceFee)
    : Number.isFinite(booking.feeService) ? Number(booking.feeService)
    : FALLBACK_FEES.service;

  const taxesFee =
    Number.isFinite(p.taxAmount) ? Number(p.taxAmount)
    : Number.isFinite(booking.feeTax) ? Number(booking.feeTax)
    : FALLBACK_FEES.taxes;

  // Base revenue (nightly). Use server baseAmount if present, else derive.
  let baseAmount = Number.isFinite(p.baseAmount) ? Number(p.baseAmount) : undefined;
  if (!Number.isFinite(baseAmount)) {
    const nightly = Number(home?.price);
    if (Number.isFinite(nightly) && booking.checkInDate && booking.checkOutDate) {
      baseAmount = nightly * nightsBetween(booking.checkInDate, booking.checkOutDate);
    } else {
      baseAmount = Math.max(0, total - (cleaningFee + serviceFee + taxesFee));
    }
  }

  // Commission is fixed policy: 10% of gross
  const commission = round2(total * COMMISSION_RATE);

  return {
    id: p.paymentId || p._id || String(p.id || ""),
    status: p.status,
    currency,
    homeId: String(home._id || p.homeId || ""),
    homeTitle: home.title || p.homeTitle || "—",
    baseAmount,
    commission,
    serviceFee,
    total,
  };
}

export default function CommissionFees() {
  const { payments: rawPayments, getAllPayments, loading, error } = usePaymentStore();

  // Load all payments once for the report
  useEffect(() => {
    if (typeof getAllPayments === "function") {
      getAllPayments({ page: 1, limit: 500 }).catch(() => {});
    }
  }, [getAllPayments]);

  // Only rows that completed money flow
  const rows = useMemo(() => {
    const list = toArray(rawPayments);
    return list
      .filter((p) => ["succeeded", "payout_completed"].includes(p.status))
      .map(normalizePayment);
  }, [rawPayments]);

  const ccy = rows[0]?.currency || "LKR";

  // Group by property
  const byProperty = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      const key = r.homeId || r.homeTitle;
      if (!map.has(key)) {
        map.set(key, {
          homeId: r.homeId,
          homeTitle: r.homeTitle,
          bookings: 0,
          revenue: 0,
          commission: 0,
          serviceFees: 0,
        });
      }
      const agg = map.get(key);
      agg.bookings += 1;
      agg.revenue += r.baseAmount;
      agg.commission += r.commission;     // 10% of gross
      agg.serviceFees += r.serviceFee;
    }

    return [...map.values()].map((x) => ({
      ...x,
      commissionRate: COMMISSION_LABEL,
      totalEarnings: x.commission + x.serviceFees,
    }));
  }, [rows]);

  // Totals for KPIs/footer
  const totals = useMemo(() => {
    const bookings = rows.length;
    const revenue = rows.reduce((s, r) => s + r.baseAmount, 0);
    const commission = rows.reduce((s, r) => s + r.commission, 0);
    const serviceFees = rows.reduce((s, r) => s + r.serviceFee, 0);
    return { bookings, revenue, commission, serviceFees };
  }, [rows]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DollarSign className="text-emerald-600" />
        <h2 className="text-xl font-semibold text-slate-800">Commission & Fees Report</h2>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard icon={CalendarDays} title="Total Bookings" value={totals.bookings.toLocaleString()} badge=" " theme="blue" />
        <KpiCard icon={TrendingUp} title="Total Revenue" value={money(totals.revenue, ccy)} badge=" " theme="green" />
        <KpiCard icon={Percent} title="Commission Earned" value={money(totals.commission, ccy)} badge="%" theme="purple" />
        <KpiCard icon={DollarSign} title="Service Fees" value={money(totals.serviceFees, ccy)} badge="$" theme="amber" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Property Commission Breakdown</h3>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading…</div>
        ) : error ? (
          <div className="p-6 text-red-600">{String(error)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Property</Th>
                  <Th>Bookings</Th>
                  <Th>Revenue</Th>
                  <Th>Commission Rate</Th>
                  <Th>Commission</Th>
                  <Th>Service Fees</Th>
                  <Th>Total Earnings</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {byProperty
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((row) => (
                    <tr key={row.homeId || row.homeTitle} className="hover:bg-slate-50">
                      <Td className="font-medium text-slate-800">{row.homeTitle}</Td>
                      <Td>{row.bookings.toLocaleString()}</Td>
                      <Td>{money(row.revenue, ccy)}</Td>
                      <Td>{row.commissionRate}</Td>
                      <Td className="text-emerald-600 font-semibold">{money(row.commission, ccy)}</Td>
                      <Td className="text-indigo-600 font-medium">{money(row.serviceFees, ccy)}</Td>
                      <Td className="font-semibold">{money(row.totalEarnings, ccy)}</Td>
                    </tr>
                  ))}

                {/* Totals row */}
                <tr className="bg-slate-50 font-semibold">
                  <Td>Total</Td>
                  <Td>{totals.bookings.toLocaleString()}</Td>
                  <Td>{money(totals.revenue, ccy)}</Td>
                  <Td>{COMMISSION_LABEL}</Td>
                  <Td className="text-emerald-700">{money(totals.commission, ccy)}</Td>
                  <Td className="text-indigo-700">{money(totals.serviceFees, ccy)}</Td>
                  <Td>{money(totals.commission + totals.serviceFees, ccy)}</Td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Commission is fixed at {COMMISSION_LABEL} of the gross amount for each completed payment.
        Revenue equals nightly base (excludes cleaning/service/tax).
      </p>
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

function KpiCard({ icon: Icon, title, value, badge, theme = "blue" }) {
  const themeMap = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    purple: "bg-purple-600",
    amber: "bg-amber-600",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
      <div className={`${themeMap[theme]} p-3 rounded-lg text-white`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="text-slate-500 text-sm">{title}</div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
      </div>
      {badge ? <div className="text-slate-400 text-xl" aria-hidden>{badge}</div> : null}
    </div>
  );
}

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-3 text-sm text-slate-700 ${className}`}>{children}</td>
);
