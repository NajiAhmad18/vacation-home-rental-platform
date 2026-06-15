// models/payment.model.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // Links
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // property owner
      required: true,
      index: true,
    },

    // Provider / status
    provider: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
      required: true,
    },
    providerPaymentId: {
      type: String, // Stripe PaymentIntent id (pi_...)
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",       // used in app state; safe to keep here too
        "succeeded",
        "failed",
        "refunded",
        "payout_completed",
      ],
      default: "pending",
      index: true,
    },

    // Totals (guest paid) & currency
    amount: { type: Number, required: true }, // total paid by guest (incl. fees)
    currency: { type: String, default: "usd" },
    method: {
      type: String,
      enum: ["card", "wallet", "bank_transfer"],
      default: "card",
    },

    // ---- Split breakdown (persisted on success) ----
    baseAmount:   { type: Number, default: 0 }, // nightly total before fees
    cleaningFee:  { type: Number, default: 0 },
    serviceFee:   { type: Number, default: 0 }, // platform keeps this
    taxAmount:    { type: Number, default: 0 },
    commission:   { type: Number, default: 0 }, // 10% of base
    payoutAmount: { type: Number, default: 0 }, // owner gets this
    ownerPayoutTotal: { type: Number, default: 0 },
    platformRevenueTotal: { type: Number, default: 0 },

    // Artifacts/metadata
    invoiceUrl: { type: String },
    receiptUrl: { type: String },
    paidAt:     { type: Date },
  },
  { timestamps: true }
);

// Helpful indexes
PaymentSchema.index({ ownerId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = mongoose.model("Payment", PaymentSchema);
