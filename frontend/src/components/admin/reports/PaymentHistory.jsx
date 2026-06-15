// src/pages/reports/PaymentHistory.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Search, Filter, Download, CreditCard, FileText, ExternalLink,
  RotateCcw, Banknote, Calendar, MapPin, User, Loader2, Trash2, X
} from "lucide-react";
import { usePaymentStore } from "../../../stores/usePaymentStore"; // ✅ fixed path

// Server-aligned fee fallbacks (used only if server didn't send values)
const FALLBACK_FEES = Object.freeze({ cleaning: 75, service: 89, taxes: 112 });

/* ---------- helpers ---------- */
const toArray = (x) => (Array.isArray(x) ? x : x?.items ?? []);
const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "—");
const money = (n, ccy = "LKR") =>
  Number.isFinite(n)
    ? new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(n)
    : "—";

// derive nights when baseAmount is missing but nightly price & dates exist
const toUTCMidnight = (d) => { const x = new Date(d); return Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()); };
const nightsBetween = (ci, co) => {
  const ms = toUTCMidnight(co) - toUTCMidnight(ci);
  return ms > 0 ? Math.round(ms / 86400000) : 0;
};

/** Align client with /payments/all expanded rows and the commission policy (10% of gross) */
const normalize = (p) => {
  const booking = p.booking || p.bookingId || {};
  const home    = p.home || p.homeId || {};
  const guest   = p.guest || booking.guest || {};

  const id = p.paymentId || p._id;
  const bookingId =
    typeof p.bookingId === "string"
      ? p.bookingId
      : booking?._id || p.bookingId || p.booking_id;

  const currency = (p.currency || booking.currency || "lkr").toUpperCase(); // ✅ default to LKR

  // Total first (gross amount captured)
  const total = Number(p.amount ?? booking.totalPrice ?? 0);

  // Fees & base (prefer server values; otherwise fall back)
  let   baseAmount   = Number.isFinite(p.baseAmount) ? p.baseAmount : undefined;
  const cleaningFee  = Number.isFinite(p.cleaningFee) ? p.cleaningFee : FALLBACK_FEES.cleaning;
  const serviceFee   = Number.isFinite(p.serviceFee)  ? p.serviceFee  : FALLBACK_FEES.service;
  const taxesFee     = Number.isFinite(p.taxesFee)    ? p.taxesFee
                       : Number.isFinite(p.taxAmount) ? p.taxAmount   : FALLBACK_FEES.taxes;

  // derive base if missing and nightly price + dates are available
  const nightlyPriceNum = Number(home?.price);
  if (
    !Number.isFinite(baseAmount) &&
    Number.isFinite(nightlyPriceNum) &&
    booking.checkInDate &&
    booking.checkOutDate
  ) {
    baseAmount = nightlyPriceNum * nightsBetween(booking.checkInDate, booking.checkOutDate);
  }
  if (!Number.isFinite(baseAmount)) {
    // If still missing, derive from gross minus explicit fees
    baseAmount = Math.max(0, total - (cleaningFee + serviceFee + taxesFee));
  }

  // Commission = 10% of total amount (gross) when not provided by server
  const commission = Number.isFinite(p.commission)
    ? p.commission
    : Math.round(((total * 0.10) + Number.EPSILON) * 100) / 100;

  // Owner payout rule: total - (commission + service)
  // (equivalent to base-after-commission + cleaning + taxes)
  const ownerPayout =
    Number.isFinite(p.ownerPayoutTotal) ? p.ownerPayoutTotal
      : Number.isFinite(p.payoutAmount) ? (
          // p.payoutAmount assumed to be base-after-commission
          Number(p.payoutAmount) + cleaningFee + taxesFee
        )
      : (total - (commission + serviceFee));

  return {
    id,
    status: p.status,
    providerPaymentId: p.providerPaymentId || p.intentId,
    createdAt: p.createdAt,
    paidAt: p.paidAt || booking.paidAt,
    bookingId,
    homeTitle: home.title ?? p.homeTitle,
    homeCity: home?.location?.city,
    homeProvince: home?.location?.province,
    checkIn: p.checkIn || booking.checkInDate,
    checkOut: p.checkOut || booking.checkOutDate,

    // guest details
    guestName:  p.guestName  || booking.fullName || guest.name || null,
    guestEmail: p.guestEmail || guest.email || null,

    currency,
    total,
    baseAmount,
    cleaningFee,
    serviceFee,
    taxesFee,
    commission,
    ownerPayout,
    invoiceUrl: p.invoiceUrl,
    receiptUrl: p.receiptUrl,
  };
};

const StatusBadge = ({ value }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    succeeded: "bg-green-100 text-green-800",
    refunded: "bg-gray-100 text-gray-800",
    payout_completed: "bg-purple-100 text-purple-800",
    failed: "bg-red-100 text-red-800",
    default: "bg-slate-100 text-slate-800",
  };
  const cls = map[value] || map.default;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
      {String(value || "unknown").replace(/_/g, " ")}
    </span>
  );
};

/* -------------------------- Confirm Dialog -------------------------- */

function ConfirmDialog({
  open,
  icon: Icon,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  confirming = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-slate-900/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-blue-600/10 p-2">
              {Icon ? <Icon className="h-5 w-5 text-blue-600" /> : null}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-slate-600 text-sm">{message}</p>
            </div>
            <button
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              onClick={onCancel}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={confirming}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={confirming}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================== Page =============================== */

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // modal state
  const [confirm, setConfirm] = useState({ open: false, type: null, row: null });
  const [acting, setActing] = useState(false);

  const {
    payments: rawPayments,
    getAllPayments,
    refundPayment,   // used by modal
    payoutOwner,     // used by modal
    deletePayment,
    loading,
  } = usePaymentStore();

  // Initial load (admins: all payments with home/guest)
  useEffect(() => {
    if (typeof getAllPayments === "function") {
      getAllPayments({ page: 1, limit: 200 }).catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rowsAll = useMemo(() => toArray(rawPayments).map(normalize), [rawPayments]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rowsAll.filter((p) => {
      const matchesStatus = statusFilter === "all" ? true : p.status === statusFilter;
      if (!term) return matchesStatus;
      const haystack = [
        p.id, p.providerPaymentId, p.bookingId, p.homeTitle,
        p.guestName, p.guestEmail, p.homeCity, p.homeProvince,
      ].filter(Boolean).join(" ").toLowerCase();
      return matchesStatus && haystack.includes(term);
    });
  }, [rowsAll, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  useEffect(() => setCurrentPage(1), [searchTerm, statusFilter]);

  // Open modal for refund/payout
  const askRefund = (row) => setConfirm({ open: true, type: "refund", row });
  const askPayout = (row) => setConfirm({ open: true, type: "payout", row });

  // Execute confirmed action
  const doConfirmed = async () => {
    if (!confirm?.row) return;
    setActing(true);
    try {
      if (confirm.type === "refund" && refundPayment) {
        await refundPayment(confirm.row.id);
      } else if (confirm.type === "payout" && payoutOwner) {
        await payoutOwner(confirm.row.id);
      }
      if (getAllPayments) await getAllPayments({ page: 1, limit: 200 });
    } finally {
      setActing(false);
      setConfirm({ open: false, type: null, row: null });
    }
  };

  const onDelete = async (id, status) => {
    if (!deletePayment) return;
    const hard = status === "refunded";
    const ok = window.confirm(
      hard
        ? "Permanently delete this refunded payment?"
        : "Delete this payment? (Only allowed if not captured/payout completed)"
    );
    if (!ok) return;
    await deletePayment(id, { hard });
    if (getAllPayments) await getAllPayments({ page: 1, limit: 200 });
  };

  const exportCSV = () => {
    const header = [
      "Payment ID","Status","Paid At","Booking ID","Home",
      "Guest","Total","Base","Commission","Service","Cleaning","Taxes","Owner Payout","Currency",
    ];
    const lines = filtered.map((p) =>
      [
        p.id, p.status, p.paidAt || p.createdAt, p.bookingId, p.homeTitle || "",
        p.guestName || p.guestEmail || "",
        p.total, p.baseAmount, p.commission, p.serviceFee, p.cleaningFee, p.taxesFee, p.ownerPayout, p.currency,
      ].map((x) => `"${String(x ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Filters & Search */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by payment, booking, guest, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none w-80"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="succeeded">Succeeded</option>
                <option value="refunded">Refunded</option>
                <option value="payout_completed">Payout Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{filtered.length}</span> payments found
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              disabled={filtered.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mx-6 my-4 flex items-center gap-2 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading payments…</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mx-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking / Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amounts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageRows.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-200">
                  {/* Payment */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{String(p.id).slice(-6)}</div>
                    <div className="text-xs text-gray-500">Paid: {fmtDate(p.paidAt)}</div>
                    {!p.paidAt && <div className="text-xs text-gray-500">Created: {fmtDate(p.createdAt)}</div>}
                  </td>

                  {/* Booking / Property */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{p.homeTitle || "—"}</div>
                    {(p.homeCity || p.homeProvince) && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {p.homeCity ?? "—"}, {p.homeProvince ?? "—"}
                      </div>
                    )}
                    {p.checkIn && p.checkOut && (
                      <div className="text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(p.checkIn).toLocaleDateString()} – {new Date(p.checkOut).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* Guest */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{p.guestName || "—"}</div>
                      </div>
                    </div>
                  </td>

                  {/* Amounts */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{money(p.total, p.currency)}</div>
                    <div className="text-xs text-gray-500">
                      {Number.isFinite(p.baseAmount) && <>Base: {money(p.baseAmount, p.currency)} • </>}
                      Comm: {money(p.commission, p.currency)} • Service: {money(p.serviceFee, p.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number.isFinite(p.cleaningFee) && <>Cleaning: {money(p.cleaningFee, p.currency)} • </>}
                      {Number.isFinite(p.taxesFee) && <>Taxes: {money(p.taxesFee, p.currency)}</>}
                    </div>
                    <div className="text-xs text-emerald-700 font-medium mt-0.5">
                      Owner payout: {money(p.ownerPayout, p.currency)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge value={p.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {/* Invoice */}
                      {p.invoiceUrl && (
                        <a
                          href={p.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="View invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      )}

                      {/* Open in Stripe */}
                      {p.providerPaymentId && (
                        <a
                          href={`${(import.meta.env.VITE_STRIPE_MODE === "test"
                            ? "https://dashboard.stripe.com/test"
                            : "https://dashboard.stripe.com")}/payments/${p.providerPaymentId}`} // ✅ test vs live
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="Open in Stripe"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      {/* Refund → open confirm */}
                      <button
                        onClick={() => askRefund(p)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 disabled:opacity-50"
                        disabled={loading || p.status !== "succeeded"}
                        title="Refund payment"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>

                      {/* Payout to owner → open confirm */}
                      <button
                        onClick={() => askPayout(p)}
                        className="text-emerald-700 hover:text-emerald-900 p-1 rounded hover:bg-emerald-50 disabled:opacity-50"
                        disabled={loading || p.status !== "succeeded"}
                        title="Payout to owner"
                      >
                        <Banknote className="h-4 w-4" />
                      </button>

                      {/* Delete (kept simple with native confirm) */}
                      <button
                        onClick={() => onDelete(p.id, p.status)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        disabled={loading || ["succeeded", "payout_completed"].includes(p.status)}
                        title={
                          ["succeeded", "payout_completed"].includes(p.status)
                            ? "Cannot delete captured/payout-completed payment"
                            : "Delete payment"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="px-3 py-1 rounded-lg bg-white ring-1 ring-slate-200 text-sm hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-slate-600">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
          <button
            className="px-3 py-1 rounded-lg bg-white ring-1 ring-slate-200 text-sm hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mt-6 mx-6">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "Payments will appear here once bookings are paid."}
          </p>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmDialog
        open={confirm.open}
        icon={confirm.type === "refund" ? RotateCcw : Banknote}
        title={confirm.type === "refund" ? "Refund this payment?" : "Payout to owner?"}
        message={
          confirm.row
            ? `${confirm.type === "refund" ? "This will issue a refund for" : "This will pay out to owner for"} payment #${String(confirm.row.id).slice(-6)} (${money(confirm.row.total, confirm.row.currency)}).`
            : ""
        }
        confirmText={confirm.type === "refund" ? "Refund" : "Payout"}
        confirming={acting}
        onConfirm={doConfirmed}
        onCancel={() => setConfirm({ open: false, type: null, row: null })}
      />
    </div>
  );
}
