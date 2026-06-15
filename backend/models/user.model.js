import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "roomOwner", "admin"],
      default: "user",
    },

    // Normal user profile
    profile: {
      fullName: { type: String },
      phoneNumber: { type: String },
      profileImage: { type: String }, // URL to profile picture
      bio: { type: String },
      location: { type: String },
    },

    // Room Owner specific profile
    roomOwnerProfile: {
      idCardNumber: { type: String },
      idCardImages: {
        front: { type: String }, // NIC/ID Front
        back: { type: String }, // NIC/ID Back
      },
      verificationStatus: {
        type: String,
        enum: ["not_submitted", "pending", "verified", "rejected"],
        default: "not_submitted",
      },
      rejectionReason: { type: String },
      verifiedAt: { type: Date },
    },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
