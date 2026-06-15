// src/pages/reports/ProfitAndLoss.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  Percent,
  Receipt,
  TrendingUp,
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
} from "lucide-react";
import axiosInstance from "../../../lib/axios"; // ← path fix

// ---- client fallbacks (aligned with backend defaults) ----
const FALLBACK_FEES = Object.freeze({ cleaning: 75, service: 89, taxes: 112 });
const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
const money = (n, ccy = "LKR") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(
    Number(n || 0)
  );

// inclusive (>= start, <= end) test
const inRange = (d, start, end) => {
  const t = new Date(d).getTime();
  return t >= new Date(start).setHours(0, 0, 0, 0) && t <= new Date(end).setHours(23, 59, 59, 999);
};

// Normalize the shape returned by /payments/all (or any compatible list)
const normalizePayment = (p) => {
  const booking = p.booking || p.bookingId || {};
  const home = p.home || p.homeId || {};

  const currency = (p.currency || booking.currency || "lkr").toUpperCase();
  const total = Number(p.amount ?? booking.totalPrice ?? 0);

  const cleaningFee =
    Number.isFinite(p.cleaningFee) ? Number(p.cleaningFee)
    : Number.isFinite(booking.feeCleaning) ? Number(booking.feeCleaning)
    : FALLBACK_FEES.cleaning;

  const serviceFee =
    Number.isFinite(p.serviceFee) ? Number(p.serviceFee)
    : Number.isFinite(booking.feeService) ? Number(booking.feeService)
    : FALLBACK_FEES.service;

  const taxesFee =
    Number.isFinite(p.taxesFee) ? Number(p.taxesFee)
    : Number.isFinite(p.taxAmount) ? Number(p.taxAmount)
    : Number.isFinite(booking.feeTax) ? Number(booking.feeTax)
    : FALLBACK_FEES.taxes;

  const baseAmount = Number.isFinite(p.baseAmount)
    ? Number(p.baseAmount)
    : Math.max(0, total - (cleaningFee + serviceFee + taxesFee));

  // Commission – prefer server; otherwise 10% of gross (your policy)
  const commission = Number.isFinite(p.commission) ? Number(p.commission) : round2(total * 0.1);

  // Owner payout (platform model): gross - (commission + service),
  // or if server provided, trust it; or payoutAmount+cleaning+tax as second choice
  const ownerPayout =
    Number.isFinite(p.ownerPayoutTotal)
      ? Number(p.ownerPayoutTotal)
      : Number.isFinite(p.payoutAmount)
      ? round2(Number(p.payoutAmount) + cleaningFee + taxesFee)
      : round2(total - (commission + serviceFee));

  return {
    id: p.paymentId || p._id,
    status: p.status,
    createdAt: p.createdAt,
    currency,
    total,
    baseAmount,
    commission,
    serviceFee,
    cleaningFee,
    taxesFee,
    ownerPayout,
    property: home?.title,
  };
};

const SummaryCard = ({ icon: Icon, title, value, sub }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-slate-800/90">
        <Icon className="text-white" size={20} />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-1">{value}</h3>
    <p className="text-slate-600 text-sm">{title}</p>
    {sub ? <p className="text-slate-400 text-xs mt-1">{sub}</p> : null}
  </div>
);

export default function ProfitAndLoss() {
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]); // normalized payments
  const [ccy, setCcy] = useState("LKR");

  // Try server P&L first; if 404, fall back to computing from /payments/all
  const load = async () => {
    setLoading(true);
    try {
      // (B) Fallback – compute client-side from the expanded payments endpoint
      const { data } = await axiosInstance.get("/payments/all", {
        params: { start, end, sort: "-createdAt" },
      });
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      const normalized = list.map(normalizePayment).filter((p) => inRange(p.createdAt, start, end));
      setRows(normalized);
      if (normalized[0]?.currency) setCcy(normalized[0].currency);
      setLoading(false);
    } catch (err) {
      console.error("P&L load failed:", err);
      setRows([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  // ---- Derived totals (Marketplace / take-rate model) ----
  const totals = useMemo(() => {
    const succeeded = rows.filter((r) => ["succeeded", "payout_completed"].includes(r.status));
    const refunded = rows.filter((r) => r.status === "refunded");

    const grossBookings = round2(succeeded.reduce((s, r) => s + r.total, 0));
    const commissionIncome = round2(succeeded.reduce((s, r) => s + r.commission, 0));
    const serviceFeeIncome = round2(succeeded.reduce((s, r) => s + r.serviceFee, 0));
    const platformRevenue = round2(commissionIncome + serviceFeeIncome);

    const refundsGross = round2(refunded.reduce((s, r) => s + r.total, 0));
    const ownerPayouts = round2(
      succeeded.reduce((s, r) => s + (Number.isFinite(r.ownerPayout) ? r.ownerPayout : 0), 0)
    );

    const netRevenue = platformRevenue; // owner payouts are pass-through
    const netIncome = netRevenue;       // no OpEx modeled yet

    return {
      grossBookings,
      commissionIncome,
      serviceFeeIncome,
      platformRevenue,
      refundsGross,
      ownerPayouts,
      netRevenue,
      netIncome,
    };
  }, [rows]);

  const exportCSV = () => {
    const header = [
      "Date",
      "Payment ID",
      "Status",
      "Property",
      "Gross",
      "Commission",
      "Service Fee",
      "Owner Payout (derived)",
    ];
    const lines = rows.map((r) =>
      [
        new Date(r.createdAt).toISOString(),
        r.id,
        r.status,
        r.property || "",
        r.total,
        r.commission,
        r.serviceFee,
        r.ownerPayout,
      ]
        .map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pnl-${start}_to_${end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header / Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">P&amp;L Statement</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
              <CalendarIcon className="h-4 w-4" />
              Period: {start} – {end}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">From</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">To</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={load}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:opacity-90"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={!rows.length}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          icon={Wallet}
          title="Gross Bookings"
          value={money(totals.grossBookings, ccy)}
          sub="Sum of successful payments"
        />
        <SummaryCard
          icon={Percent}
          title="Commission Earned"
          value={money(totals.commissionIncome, ccy)}
          sub="Platform commission"
        />
        <SummaryCard
          icon={Receipt}
          title="Service Fees"
          value={money(totals.serviceFeeIncome, ccy)}
          sub="Guest service charges"
        />
        <SummaryCard
          icon={TrendingUp}
          title="Platform Revenue (Commission + Service)"
          value={money(totals.platformRevenue, ccy)}
          sub="Gross platform revenue"
        />
      </div>

      {/* Detailed P&L */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Statement</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3 pr-4 text-slate-600">Revenue</td>
                <td />
              </tr>
              <tr>
                <td className="py-2 pl-6 text-slate-600">Commission income</td>
                <td className="py-2 text-right font-medium">{money(totals.commissionIncome, ccy)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-6 text-slate-600">Service fee income</td>
                <td className="py-2 text-right font-medium">{money(totals.serviceFeeIncome, ccy)}</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 font-semibold">Total Revenue</td>
                <td className="py-2 text-right font-semibold">{money(totals.platformRevenue, ccy)}</td>
              </tr>

              <tr className="border-b">
                <td className="pt-6 pb-3 pr-4 text-slate-600">Other</td>
                <td />
              </tr>
              <tr>
                <td className="py-2 pl-6 text-slate-600">Owner payouts (pass-through)</td>
                <td className="py-2 text-right">{money(totals.ownerPayouts, ccy)}</td>
              </tr>
              <tr>
                <td className="py-2 pl-6 text-slate-600">Refunds (gross bookings)</td>
                <td className="py-2 text-right">{money(totals.refundsGross, ccy)}</td>
              </tr>

              <tr className="border-t">
                <td className="py-3 font-semibold">Net Revenue (platform)</td>
                <td className="py-3 text-right font-semibold">{money(totals.netRevenue, ccy)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500 text-xs" colSpan={2}>
                  * This marketplace model recognizes revenue as commission + service fees. Owner payouts are
                  pass-through (not expenses). If you later track fee refunds or operating expenses, subtract them to
                  get Net Income.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Breakdown table */}
        <h3 className="text-md font-semibold text-slate-800 mt-8 mb-3">Payment Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Payment</th>
                <th className="px-3 py-2 text-left">Property</th>
                <th className="px-3 py-2 text-right">Gross</th>
                <th className="px-3 py-2 text-right">Commission</th>
                <th className="px-3 py-2 text-right">Service</th>
                <th className="px-3 py-2 text-right">Owner Payout</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="px-3 py-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2">#{String(r.id).slice(-6)}</td>
                  <td className="px-3 py-2">{r.property || "—"}</td>
                  <td className="px-3 py-2 text-right">{money(r.total, r.currency)}</td>
                  <td className="px-3 py-2 text-right">{money(r.commission, r.currency)}</td>
                  <td className="px-3 py-2 text-right">{money(r.serviceFee, r.currency)}</td>
                  <td className="px-3 py-2 text-right">{money(r.ownerPayout, r.currency)}</td>
                  <td className="px-3 py-2">{r.status}</td>
                </tr>
              ))}
              {!rows.length && !loading && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-slate-500">
                    No payments in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
