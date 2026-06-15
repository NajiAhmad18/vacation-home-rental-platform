import mongoose from "mongoose";

const ledgerEntrySchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },
    type: {
      type: String,
      enum: [
        "payment_capture",
        "escrow_account",
        "payout_owner",
        "commission_income",
        "service_fee_income", 
        "refund",
        "adjustment",
      ],
      required: true,
    },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    currency: { type: String, default: "LKR" },
    accounts: {
      from: { type: String, required: true }, // e.g., "user_wallet","escrow","platform_revenue","owner_payable"
      to: { type: String, required: true },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    note: String,
  },
  { timestamps: true }
);

export const LedgerEntry = mongoose.model("LedgerEntry", ledgerEntrySchema);
