// components/PaymentForm.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { usePaymentStore } from "../stores/usePaymentStore";
import { useNavigate } from "react-router-dom";

const fmt = (n, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(Number(n || 0));

export default function PaymentForm({ bookingId, displayAmount = 0, currency = "usd", onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { getOrCreatePaymentIntent, confirmAndFinalize } = usePaymentStore();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [uiAmount, setUiAmount] = useState(displayAmount);
  const [uiCurrency, setUiCurrency] = useState((currency || "usd").toUpperCase());

  const cardElementOptions = {
    hidePostalCode: true,
    style: {
      base: { fontSize: "16px", color: "#0f172a", "::placeholder": { color: "#94a3b8" } },
      invalid: { color: "#ef4444" },
    },
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMsg("");

    try {
      // 1) Get/create PaymentIntent (server is authoritative)
      const { clientSecret, paymentId, amount, currency: serverCurrency } =
        await getOrCreatePaymentIntent(bookingId);

      if (typeof amount === "number") setUiAmount(amount);
      if (serverCurrency) setUiCurrency(serverCurrency.toUpperCase());

      // 2) Confirm with Stripe, then finalize on backend
      const card = elements.getElement(CardElement);
      if (!card) throw new Error("CardElement not found");

      const { stripe: paymentIntent, server } = await confirmAndFinalize({
        stripe,
        elements,
        clientSecret,
        paymentId,
      });

      // 3) Redirect to success page with links
      if (paymentIntent?.status === "succeeded") {
        onPaid?.(paymentIntent, {
          amount,
          currency: (serverCurrency || currency || "usd").toUpperCase(),
        });

        // Build Tailwind HTML invoice URL on the server page (avoid envs here)
        navigate("/payment-success", {
          replace: true,
          state: {
            paymentId,
            invoiceUrl: server?.invoiceUrl || null,  // server-generated PDF
            receiptUrl: server?.receiptUrl || null,  // Stripe receipt (if available)
             amount,                                
             currency: (serverCurrency || currency || "usd").toUpperCase(), 
          },
        });
        return;
      }

      setMsg(`Payment is ${paymentIntent?.status || "in an unknown state"}.`);
    } catch (err) {
      setMsg(err?.message || "Payment error.");
    } finally {
      setLoading(false);
    }
  };

  const amountInvalid = !Number.isFinite(Number(uiAmount)) || Number(uiAmount) <= 0;

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-6">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">Card details</span>
          <div className="rounded-xl border border-slate-300 px-3 py-3 bg-white focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition">
            <CardElement options={cardElementOptions} />
          </div>
        </label>

        <button
          type="submit"
          disabled={!stripe || loading || amountInvalid}
          className={`w-full h-12 rounded-xl text-white text-lg font-semibold shadow-sm transition
            ${(!stripe || loading || amountInvalid) ? "bg-blue-600/60 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
          aria-disabled={!stripe || loading || amountInvalid}
        >
          {loading ? "Processing…" : `Pay ${fmt(uiAmount, uiCurrency)}`}
        </button>

        {msg && (
          <p className={`text-sm ${msg.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}
