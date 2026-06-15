// src/components/admin/reports/BalanceSheet.jsx
import React, { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useLedgerStore } from "../../../stores/useLedgerStore";
import { usePaymentStore } from "../../../stores/usePaymentStore";

// currency helper
const money = (n, ccy = "LKR") =>
  Number.isFinite(n)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n)
    : "—";

// Normalize a payment to safely read owner payout and currency
const normalizePayment = (p) => {
  const currency = (p.currency || "LKR").toUpperCase();
  const total = Number(p.amount ?? 0);
  const commission = Number(p.commission ?? 0);
  const serviceFee = Number(p.serviceFee ?? 0);
  const cleaning = Number(p.cleaningFee ?? 0);
  const taxes = Number(p.taxesFee ?? p.taxAmount ?? 0);

  // Prefer server-provided rollups if present
  const ownerPayout =
    Number.isFinite(p.ownerPayoutTotal)
      ? Number(p.ownerPayoutTotal)
      : Number.isFinite(p.payoutAmount)
        ? Number(p.payoutAmount) + cleaning + taxes
        : total - (commission + serviceFee);

  return {
    status: p.status,
    currency,
    ownerPayout: Math.max(0, Number(ownerPayout || 0)),
  };
};

export default function BalanceSheet() {
  const {
    adminSummary,
    getAdminSummary,     // <- correct name from store
    loading: loadingLedger,
  } = useLedgerStore();

  const {
    payments,
    getAllPayments,
    loading: loadingPayments,
  } = usePaymentStore();

  // Initial load
  useEffect(() => {
    getAdminSummary().catch(() => {});
    // Pull a reasonable chunk; increase if you expect more rows
    getAllPayments({ page: 1, limit: 500 }).catch(() => {});
  }, [getAdminSummary, getAllPayments]);

  // Currency preference: try to infer from first payment; fallback LKR
  const currency = useMemo(() => {
    const first = Array.isArray(payments) && payments[0];
    return (first?.currency || "LKR").toUpperCase();
  }, [payments]);

  // Owner payables outstanding = sum of payouts for succeeded but not yet paid out
  const ownerPayablesOutstanding = useMemo(() => {
    if (!Array.isArray(payments)) return 0;
    return payments
      .map(normalizePayment)
      .filter((p) => p.status === "succeeded") // captured & not refunded
      .reduce((sum, p) => sum + p.ownerPayout, 0);
  }, [payments]);

  // If you mark payouts by updating the payment to "payout_completed",
  // exclude those from the outstanding total:
  const alreadyPaidOut = useMemo(() => {
    if (!Array.isArray(payments)) return 0;
    return payments
      .map(normalizePayment)
      .filter((p) => p.status === "payout_completed")
      .reduce((sum, p) => sum + p.ownerPayout, 0);
  }, [payments]);

  const escrowCash = Number(adminSummary?.escrowBalance ?? 0);

  const totalAssets = escrowCash;
  const totalLiabilities = ownerPayablesOutstanding;
  const equity = totalAssets - totalLiabilities;

  const loading = loadingLedger || loadingPayments;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Balance Sheet</h1>
        <p className="text-slate-500 text-sm">
          As of {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Assets" value={money(totalAssets, currency)} accent="ring-emerald-200" />
        <Card title="Total Liabilities" value={money(totalLiabilities, currency)} accent="ring-rose-200" />
        <Card title="Owner's Equity" value={money(equity, currency)} accent="ring-blue-200" />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-600 mb-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading…</span>
        </div>
      )}

      {/* Assets & Liabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200">
          <header className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Assets</h2>
          </header>
          <div className="p-5 space-y-3">
            <Row label="Cash & Escrow" value={money(escrowCash, currency)} />
            <Divider />
            <Row label={<span className="font-medium">Total Assets</span>} value={<b>{money(totalAssets, currency)}</b>} />
          </div>
        </section>

        {/* Liabilities */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200">
          <header className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Liabilities</h2>
          </header>
          <div className="p-5 space-y-3">
            <Row
              label="Owner payables (outstanding)"
              value={money(ownerPayablesOutstanding, currency)}
            />
            <Row muted label="Owner payouts already paid" value={money(alreadyPaidOut, currency)} />
            <Divider />
            <Row label={<span className="font-medium">Total Liabilities</span>} value={<b>{money(totalLiabilities, currency)}</b>} />
          </div>
        </section>
      </div>

      {/* Equity */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
        <header className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Owner’s Equity</h2>
        </header>
        <div className="p-5">
          <Row label="Owner’s Equity" value={money(equity, currency)} />
        </div>
      </section>

      {/* Totals Check */}
      <section className="bg-blue-50 border border-blue-200 rounded-xl mt-6 p-5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-blue-900">Total Liabilities &amp; Equity</span>
          <span className="font-bold text-blue-900">
            {money(totalLiabilities + equity, currency)}
          </span>
        </div>
        <p className="text-xs text-blue-800 mt-1">
          This should equal Total Assets (simple check).
        </p>
      </section>

      {/* Small note */}
      <p className="text-xs text-slate-500 mt-4">
        Notes: Assets are your escrow cash. “Owner payables” are payouts still due on succeeded
        payments (excluding payouts already completed/refunded). This keeps the sheet relevant and
        minimal for the rental-platform workflow.
      </p>
    </div>
  );
}

/* ---------- small UI helpers ---------- */
function Card({ title, value, accent = "ring-slate-200" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 ring-1 ${accent}`}>
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value, muted = false }) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-slate-400" : "text-slate-700"}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-slate-100 my-1" />;
}
