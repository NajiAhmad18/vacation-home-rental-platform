import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // nights (excluding check-out day)
    bookedDates: [{ type: Date, required: true }],
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },

    totalPrice: { type: Number, required: true },
    currency: { type: String, default: "usd" },

    // booking lifecycle (hold -> active/confirmed -> completed/cancelled)
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "refunded"],
      default: "pending",
    },

    // Guest details from checkout
    fullName: { type: String },
    phoneNumber: { type: String },
    idCard: { type: String },

    // Pricing fee breakdown
    feeCleaning: { type: Number, default: 0 },
    feeService: { type: Number, default: 0 },
    feeTax: { type: Number, default: 0 },

    // Stripe references
    paymentIntentId: { type: String },
    paidAt: { type: Date },

    // payment lifecycle
    paymentStatus: {
      type: String,
      enum: ["none", "processing", "paid", "refunded"],
      default: "none",
    },

    // hold TTL (MongoDB TTL index)
    expiresAt: { type: Date, default: null },

    refundReason: { type: String },
  },
  { timestamps: true }
);

// TTL index for holds (Mongo deletes doc after expiresAt is reached)
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
