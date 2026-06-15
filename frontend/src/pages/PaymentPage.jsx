import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingSummary from "../components/BookingSummary";
import PaymentForm from "../components/PaymentForm";
import axiosInstance from "../lib/axios";
import { ArrowLeft, ShieldCheck, CreditCard, Lock, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.get(`/booking/${bookingId}`);
        const bookingData = res?.data?.data || res?.data?.booking || res?.data;
        if (ignore) return;
        setBooking(bookingData);

        const serverTotal = Number(bookingData?.totalPrice);
        if (Number.isFinite(serverTotal)) { setTotal(serverTotal); return; }

        const home = (bookingData?.homeId && typeof bookingData.homeId === "object" && bookingData.homeId) || {};
        const checkIn = new Date(bookingData?.checkInDate);
        const checkOut = new Date(bookingData?.checkOutDate);
        const nights = Math.max(0, Math.ceil((checkOut - checkIn) / 86400000));
        const basePrice = Number(home?.price || 0) * nights;
        setTotal(basePrice + 75 + 89 + 112);
      } catch (err) {
        if (!ignore) setError("Failed to load booking details.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    if (bookingId) fetchBooking();
    return () => { ignore = true; };
  }, [bookingId]);

  /* ── Loading ─────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading your booking…</p>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────── */
  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--surface)" }}>
        <div className="card p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {error || "Booking not found"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't locate this booking. Please go back and try again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary px-6 py-3 text-sm mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ── Main Page ───────────────────────────────── */
  return (
    <div className="min-h-screen pb-20 page-enter" style={{ background: "var(--surface)" }}>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Secure Checkout</h1>
            <p className="text-xs text-gray-400 mt-0.5">Complete your reservation</p>
          </div>
          {/* Trust badge */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            SSL Secured
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-10 text-xs font-semibold">
          {["Guest Details", "Review Booking", "Payment"].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                i < 2 ? "bg-blue-50 text-blue-600" : "bg-blue-600 text-white shadow-sm"
              }`}>
                {i < 2 ? <CheckCircle className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                {step}
              </div>
              {i < 2 && <div className="h-px w-8 bg-gray-300 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Booking Summary */}
          <section className="lg:sticky lg:top-24 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h2>
            <BookingSummary booking={booking} />

            {/* Trust guarantee */}
            <div className="card p-5 mt-5 space-y-3">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Guarantee</p>
              {[
                { icon: ShieldCheck, color: "text-emerald-600", text: "Your data is 256-bit SSL encrypted" },
                { icon: CreditCard, color: "text-blue-600", text: "Powered by Stripe — PCI DSS compliant" },
                { icon: Lock, color: "text-violet-600", text: "Card details are never stored on our servers" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-gray-600">
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                  {item.text}
                </div>
              ))}
            </div>
          </section>

          {/* Right: Payment Form */}
          <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h2>
            <div className="card p-6 sm:p-8 shadow-lg">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Card Payment</p>
                  <p className="text-xs text-gray-400">Powered by Stripe</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {/* Card logos as emoji placeholders */}
                  <span className="text-lg">💳</span>
                </div>
              </div>

              <PaymentForm
                bookingId={booking._id}
                displayAmount={total}
                currency={booking.currency || "usd"}
                embedded
              />

              <p className="text-xs text-gray-400 mt-5 text-center leading-relaxed">
                By completing payment, you agree to LuxeKey's Terms of Service and Booking Policy.
                Payments are processed securely via Stripe.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
