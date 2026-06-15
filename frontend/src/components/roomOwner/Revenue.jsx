// src/pages/reports/Revenue.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";
import { usePaymentStore } from "../../stores/usePaymentStore";

// Currency helper (default LKR to match backend)
const money = (n, ccy = "LKR") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(Number(n || 0));

const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;

/* Normalize one row from /payments/all */
function normalizePayment(p) {
  const booking = p.booking || p.bookingId || {};
  const home = p.home || p.homeId || {};
  return {
    id: p.paymentId || p._id,
    status: p.status,
    createdAt: p.createdAt,
    currency: (p.currency || booking.currency || "lkr").toUpperCase(),
    total: Number(p.amount ?? booking.totalPrice ?? 0), // gross captured
    property: home?.title || "—",
    checkInDate: booking.checkInDate,
    checkOutDate: booking.checkOutDate,
  };
}

/* Date helpers */
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfQuarter = (d) => new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);
const endOfDay = (d) => new Date(new Date(d).setHours(23, 59, 59, 999));

/* Nights helper (for a rough occupancy %) */
const toUTCMidnight = (x) => Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
const nightsBetween = (ci, co) => {
  if (!ci || !co) return 0;
  const ms = toUTCMidnight(new Date(co)) - toUTCMidnight(new Date(ci));
  return ms > 0 ? Math.round(ms / 86400000) : 0;
};

export default function Revenue() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { payments: raw, getAllPayments, loading, error } = usePaymentStore();

  useEffect(() => {
    // Grab plenty of rows for summaries
    getAllPayments({ page: 1, limit: 1000, sort: "-createdAt" }).catch(() => {});
  }, [getAllPayments]);

  const rows = useMemo(() => (Array.isArray(raw) ? raw.map(normalizePayment) : []), [raw]);
  const ccy = rows[0]?.currency || "LKR";

  // ----- Date ranges for selected + previous period (calendar-based) -----
  const now = new Date();
  const [rangeStart, rangeEnd, prevStart, prevEnd] = useMemo(() => {
    let s, e, ps, pe;
    if (selectedPeriod === "month") {
      s = startOfMonth(now);
      e = endOfDay(now);
      // previous calendar month
      const pmRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      ps = startOfMonth(pmRef);
      pe = endOfDay(new Date(pmRef.getFullYear(), pmRef.getMonth() + 1, 0));
    } else if (selectedPeriod === "quarter") {
      s = startOfQuarter(now);
      e = endOfDay(now);
      // previous quarter
      const pqRef = new Date(s);
      pqRef.setMonth(pqRef.getMonth() - 3);
      ps = startOfQuarter(pqRef);
      pe = endOfDay(new Date(s.getTime() - 1));
    } else {
      // year
      s = startOfYear(now);
      e = endOfDay(now);
      // previous year
      ps = startOfYear(new Date(now.getFullYear() - 1, 0, 1));
      pe = endOfDay(new Date(now.getFullYear() - 1, 11, 31));
    }
    return [s, e, ps, pe];
  }, [selectedPeriod]);

  const inRange = (d, a, b) => {
    const t = new Date(d).getTime();
    return t >= a.getTime() && t <= b.getTime();
  };

  const periodRows = useMemo(
    () => rows.filter((r) => ["succeeded", "payout_completed"].includes(r.status) && inRange(r.createdAt, rangeStart, rangeEnd)),
    [rows, rangeStart, rangeEnd]
  );
  const prevRows = useMemo(
    () => rows.filter((r) => ["succeeded", "payout_completed"].includes(r.status) && inRange(r.createdAt, prevStart, prevEnd)),
    [rows, prevStart, prevEnd]
  );

  // ----- KPIs -----
  const totalRevenue = round2(periodRows.reduce((s, r) => s + r.total, 0));
  const bookings = periodRows.length;
  const avgBookingValue = bookings ? round2(totalRevenue / bookings) : 0;

  const prevRevenue = round2(prevRows.reduce((s, r) => s + r.total, 0));
  const growth = prevRevenue > 0 ? round2(((totalRevenue - prevRevenue) / prevRevenue) * 100) : 0;

  // Rough occupancy (booked nights / (period length * properties))
  const periodDays = Math.max(1, Math.ceil((rangeEnd - rangeStart) / 86400000));
  const bookedNights = periodRows.reduce((s, r) => s + nightsBetween(r.checkInDate, r.checkOutDate), 0);
  const uniqueProps = new Set(periodRows.map((r) => r.property)).size || 1;
  const occupancy = Math.max(0, Math.min(100, round2((bookedNights / (periodDays * uniqueProps)) * 100)));

  // ----- Property performance (sum of gross) -----
  const propertyRevenue = useMemo(() => {
    const map = new Map();
    for (const r of periodRows) {
      const key = r.property || "—";
      if (!map.has(key)) map.set(key, { name: key, revenue: 0, bookings: 0 });
      const agg = map.get(key);
      agg.revenue += r.total;
      agg.bookings += 1;
    }
    const arr = [...map.values()];
    const grand = arr.reduce((s, x) => s + x.revenue, 0) || 1;
    return arr
      .map((x) => ({ ...x, percentage: Math.round((x.revenue / grand) * 100) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [periodRows]);

  // ----- Monthly trends (last 5 calendar months of gross) -----
  const monthlyTrends = useMemo(() => {
    const out = [];
    const base = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 4; i >= 0; i--) {
      const mStart = new Date(base.getFullYear(), base.getMonth() - i, 1);
      const mEnd = endOfDay(new Date(mStart.getFullYear(), mStart.getMonth() + 1, 0));
      const label = mStart.toLocaleString(undefined, { month: "short" });
      const revenue = rows
        .filter((r) => ["succeeded", "payout_completed"].includes(r.status) && inRange(r.createdAt, mStart, mEnd))
        .reduce((s, r) => s + r.total, 0);
      out.push({ month: label, revenue: round2(revenue) });
    }
    return out;
  }, [rows]);

  // Export CSV for current period
  const exportCSV = () => {
    const header = ["Date", "Payment ID", "Property", "Amount", "Status"];
    const lines = periodRows.map((r) =>
      [
        new Date(r.createdAt).toISOString(),
        r.id,
        r.property || "",
        r.total,
        r.status,
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
    a.download = `revenue-${selectedPeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxTrend = Math.max(...monthlyTrends.map((m) => m.revenue), 1);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={exportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors disabled:opacity-50"
            disabled={!periodRows.length}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Revenue"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          value={money(totalRevenue, ccy)}
          sub={`+${growth}% from last period`}
          subClass="text-green-600"
        />
        <Card
          title="Total Bookings"
          icon={<CalendarIcon className="w-6 h-6 text-blue-600" />}
          value={bookings.toLocaleString()}
          sub="Completed bookings"
          subClass="text-blue-600"
        />
        <Card
          title="Avg Booking Value"
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          value={money(avgBookingValue, ccy)}
          sub="Per booking average"
          subClass="text-purple-600"
        />
        <Card
          title="Occupancy Rate"
          icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
          value={`${occupancy}%`}
          sub="Approx. across properties"
          subClass="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Revenue Trend
          </h3>
          <div className="space-y-4">
            {monthlyTrends.map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.revenue / maxTrend) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-900 font-semibold w-24 text-right">
                    {money(item.revenue, ccy)}
                  </span>
                </div>
              </div>
            ))}
            {!monthlyTrends.length && <div className="text-sm text-gray-500">No trend data.</div>}
          </div>
        </div>

        {/* Property Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Property Performance
          </h3>
          <div className="space-y-4">
            {propertyRevenue.map((property, index) => (
              <div key={property.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{property.name}</span>
                  <span className="text-gray-600 text-sm">{property.percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === 0
                          ? "bg-blue-600"
                          : index === 1
                          ? "bg-green-600"
                          : index === 2
                          ? "bg-purple-600"
                          : "bg-orange-600"
                      }`}
                      style={{ width: `${property.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 font-semibold">{money(property.revenue, ccy)}</div>
                    <div className="text-gray-500 text-xs">{property.bookings} bookings</div>
                  </div>
                </div>
              </div>
            ))}
            {!propertyRevenue.length && <div className="text-sm text-gray-500">No property data.</div>}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <Th>Date</Th>
                <Th>Property</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {periodRows.slice(0, 10).map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <Td>{new Date(r.createdAt).toLocaleDateString()}</Td>
                  <Td>{r.property}</Td>
                  <Td className="font-semibold text-green-600">{money(r.total, r.currency)}</Td>
                  <Td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.status === "succeeded" || r.status === "payout_completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </Td>
                </tr>
              ))}
              {!periodRows.length && !loading && (
                <tr>
                  <td className="py-6 text-center text-gray-500" colSpan={4}>
                    No transactions for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error ? <p className="mt-4 text-red-600">{String(error)}</p> : null}
    </div>
  );
}

/* Small UI pieces */
function Card({ title, icon, value, sub, subClass = "" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub ? <p className={`text-sm mt-1 ${subClass}`}>{sub}</p> : null}
    </div>
  );
}

const Th = ({ children }) => (
  <th className="text-left py-3 px-6 font-medium text-gray-900">{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`py-4 px-6 text-gray-900 ${className}`}>{children}</td>
);
