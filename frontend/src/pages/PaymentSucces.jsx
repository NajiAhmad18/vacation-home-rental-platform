// src/pages/PaymentSuccess.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

// Build API base for the HTML invoice link
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  window.location.origin;
const baseNoSlash = String(API_BASE).replace(/\/+$/, "");

const fmt = (n, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(Number(n || 0));

export default function PaymentSuccess() {
  const { state } = useLocation() || {};
  const navigate = useNavigate();

  const paymentId = state?.paymentId;
  const invoiceUrl = state?.invoiceUrl; // server-generated PDF (if enabled)
  const receiptUrl = state?.receiptUrl; // Stripe receipt URL (may be null)
  const amount = state?.amount;         // optional, passed from PaymentForm navigate()
  const currency = (state?.currency || "USD").toUpperCase();

  const tailwindInvoiceUrl = useMemo(
    () => (paymentId ? `${baseNoSlash}/invoices/html/${paymentId}` : null),
    [paymentId]
  );

  // If someone hits this page directly without state, nudge them back
  if (!paymentId && !invoiceUrl && !receiptUrl) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-slate-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-slate-900">Nothing to show here</h1>
          <p className="mt-2 text-slate-600">
            This page is shown after a successful payment. If you reached it directly, head back.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const copyId = () => {
    if (!paymentId) return;
    navigator.clipboard.writeText(paymentId).catch(() => {});
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 px-4 py-14">
      <div className="mx-auto max-w-2xl">
        {/* Success header card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-green-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-green-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.28 15.22a.75.75 0 0 1-1.06 0l-2.47-2.47a.75.75 0 1 1 1.06-1.06l1.94 1.94 5.47-5.47a.75.75 0 0 1 1.06 1.06l-6 6Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 1.5a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-slate-900">
                  Payment successful!
                </h1>
                <p className="mt-2 text-slate-600">
                  Your booking is confirmed. You can download your invoice and view your receipt below.
                </p>

                {/* Amount paid chip */}
                {typeof amount === "number" && (
                  <div className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                    Amount Paid: {fmt(amount, currency)}
                  </div>
                )}
              </div>
            </div>

            {/* Summary row */}
            {(amount || paymentId) && (
              <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                {paymentId && (
                  <div className="flex items-center justify-between gap-3">
                    <span>Payment ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 break-all">{paymentId}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  <span className="mr-2">📥</span> Download Invoice (PDF)
                </a>
              )}

              {tailwindInvoiceUrl && (
                <a
                  href={tailwindInvoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  <span className="mr-2">📄</span> View Invoice
                </a>
              )}

              {receiptUrl && (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  <span className="mr-2">🧾</span> View Stripe Receipt
                </a>
              )}


            </div>
          </div>

          {/* Subtle bottom border accent */}
          <div className="h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
