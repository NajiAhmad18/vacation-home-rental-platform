import mongoose from "mongoose";

const homeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    location: {
      province: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    price: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    floorArea: { type: Number },
    floors: { type: Number },
    landArea: { type: Number },
    parking: { type: Number, default: 0 },

    features: [{ type: String }],
    images: [{ type: String }],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    isApproved: { type: Boolean, default: false }, // Admin approval
    approvalDetails: {
      electricBill: { type: String },
      waterBill: { type: String },
      additionalInfo: { type: String },
    },

    bookedDates: [{ type: String }], // Array of booked nights in YYYY-MM-DD format

    status: {
      type: String,
      enum: ["active", "hidden", "unavailable"],
      default: "active",
    }, // Home owner can hide/show the home
    // Cached rating summary
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Home", homeSchema);
