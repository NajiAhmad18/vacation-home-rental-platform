// models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // each notification belongs to a user
    },
    type: {
      type: String,
      enum: ["booking", "message", "reminder", "review", "payment", "system"],
      default: "system",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String, // e.g. "calendar", "message", "clock"
      default: "bell",
    },
    read: {
      type: Boolean,
      default: false,
    },
    // optional extra fields
    meta: {
      type: mongoose.Schema.Types.Mixed, // flexible object (bookingId, link, etc.)
    },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt automatically
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
