import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { CheckCircle, Home, Download, FileText, ExternalLink, ArrowLeft, Sparkles } from "lucide-react";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_BASE_URL) ||
  window.location.origin;
const baseNoSlash = String(API_BASE).replace(/\/+$/, "");

const fmt = (n, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(Number(n || 0));

export default function PaymentSuccess() {
  const { state } = useLocation() || {};
  const navigate = useNavigate();

  const paymentId = state?.paymentId;
  const invoiceUrl = state?.invoiceUrl;
  const receiptUrl = state?.receiptUrl;
  const amount = state?.amount;
  const currency = (state?.currency || "USD").toUpperCase();

  const tailwindInvoiceUrl = useMemo(
    () => (paymentId ? `${baseNoSlash}/invoices/html/${paymentId}` : null),
    [paymentId]
  );

  if (!paymentId && !invoiceUrl && !receiptUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--surface)" }}>
        <div className="card p-10 text-center max-w-md w-full animate-scale-in">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Nothing to show here</h1>
          <p className="text-gray-500 text-sm mb-6">
            This page appears after a successful payment. If you reached it directly, head back.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary px-6 py-3 text-sm mx-auto"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "var(--surface)" }}>
      <div className="max-w-lg w-full animate-scale-in">

        {/* ── Success Card ─────────────────────────── */}
        <div className="card overflow-hidden shadow-xl">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

          <div className="p-8 sm:p-10">
            {/* Icon + heading */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative w-20 h-20 mb-5">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-pulse-soft" />
                <div className="relative w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-500 fill-emerald-50" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                Your booking is confirmed. We've sent a confirmation to your email address.
              </p>

              {/* Amount chip */}
              {typeof amount === "number" && (
                <div className="mt-4 pill pill-green text-sm px-4 py-2">
                  ✅ {fmt(amount, currency)} Paid
                </div>
              )}
            </div>

            {/* Payment ID row */}
            {paymentId && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Payment Reference</p>
                <p className="font-mono text-sm text-gray-800 break-all">{paymentId}</p>
              </div>
            )}

            {/* ── Action Buttons ─────────────────── */}
            <div className="space-y-3 mb-6">
              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice (PDF)
                </a>
              )}

              {tailwindInvoiceUrl && (
                <a
                  href={tailwindInvoiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-all"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  View Invoice Online
                </a>
              )}

              {receiptUrl && (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-violet-600" />
                  View Stripe Receipt
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="divider" />

            {/* Back home */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="btn-primary flex-1 py-3 text-sm justify-center"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
              <Link
                to="/explore"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Browse More Stays
              </Link>
            </div>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Need help? Contact{" "}
          <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
            LuxeKey Support
          </Link>
        </p>
      </div>
    </div>
  );
}
