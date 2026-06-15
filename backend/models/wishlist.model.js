import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
    priority: { type: Number, required: true }, // auto-assigned
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1, homeId: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);
