import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingSummary from "../components/BookingSummary";
import PaymentForm from "../components/PaymentForm";
import axiosInstance from "../lib/axios";

const PaymentPage = () => {
  const { bookingId } = useParams();
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

        // Use your actual backend route here
        const res = await axiosInstance.get(`/booking/${bookingId}`);
        const bookingData = res?.data?.data || res?.data?.booking || res?.data;

        if (ignore) return;
        setBooking(bookingData);

        // Prefer server totalPrice
        const serverTotal = Number(bookingData?.totalPrice);
        if (Number.isFinite(serverTotal)) {
          setTotal(serverTotal);
          return;
        }

        // Fallback compute
        const home =
          (bookingData?.homeId &&
            typeof bookingData.homeId === "object" &&
            bookingData.homeId) ||
          {};
        const checkIn = new Date(bookingData?.checkInDate);
        const checkOut = new Date(bookingData?.checkOutDate);
        const nights = Math.max(0, Math.ceil((checkOut - checkIn) / 86400000));

        const basePrice = Number(home?.price || 0) * nights;
        const cleaningFee = 75;
        const serviceFee = 89;
        const taxes = 112;
        setTotal(basePrice + cleaningFee + serviceFee + taxes);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        if (!ignore) setError("Failed to fetch booking.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
    return () => {
      ignore = true;
    };
  }, [bookingId]);

  // ---------- UI states ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <header className="mb-8">
            <div className="h-8 w-40 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow animate-pulse h-72" />
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow animate-pulse h-72" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center px-6">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-2">
            Oops, something went wrong
          </h2>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center px-6">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
            Booking not found
          </h2>
          <p className="text-slate-600">
            We couldn’t locate this booking. Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Main page ----------
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Checkout
          </h1>
          <p className="text-slate-600 mt-1">
            Review your booking and complete the payment.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Booking Summary (sticky on large screens) */}
          <section className="lg:sticky lg:top-24">
            <BookingSummary booking={booking} />
          </section>

          {/* Right: Payment card (only one shell) */}
          <section>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Payment Information</h3>

              {/* 👇 Pass embedded so PaymentForm doesn't render its own shell */}
              <PaymentForm
                bookingId={booking._id}
                displayAmount={total}
                currency={booking.currency || "usd"}
                embedded
              />

              <p className="text-xs text-slate-500 mt-4">
                Payments are processed securely via Stripe. Your card details are never stored on our servers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
