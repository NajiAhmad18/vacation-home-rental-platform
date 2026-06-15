import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import multer from "multer";
import path from "path";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs"

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + "_profile" + ext);
  },
});
export const uploadProfileImage = multer({ storage });

// Signup - Normal User
export const signupUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password || !username) {
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
      role: "user",
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Signup - Room Owner (only basic info for now)
export const signupRoomOwner = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password || !username) {
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      username,
      role: "roomOwner",
      roomOwnerProfile: {
        verificationStatus: "not_submitted",
      },
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message:
        "Room Owner created successfully. Please complete profile to get verified.",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email not found" });
    }

    // Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(res, user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {
      "profile.fullName": req.body.fullName,
      "profile.phoneNumber": req.body.phoneNumber,
      "profile.bio": req.body.bio,
      "profile.location": req.body.location,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
        public_id: `${req.user._id}_profile`,
        overwrite: true,
      });
      updates["profile.profileImage"] = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify Room Owner (Admin action)
export const verifyRoomOwner = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { userId } = req.params; // now coming from URL

    // Only allow "verified" or "rejected"
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'verified' or 'rejected'.",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "roomOwner") {
      return res.status(404).json({
        success: false,
        message: "Room owner not found",
      });
    }

    if (
      !user.roomOwnerProfile.idCardNumber ||
      !user.roomOwnerProfile.idCardImages?.front ||
      !user.roomOwnerProfile.idCardImages?.back
    ) {
      return res.status(400).json({
        success: false,
        message: "Room owner has not submitted ID proof yet.",
      });
    }

    // Prevent re-verification only if already verified
    if (user.roomOwnerProfile.verificationStatus === "verified") {
      return res.status(400).json({
        success: false,
        message: "Room owner has already been verified.",
      });
    }

    user.roomOwnerProfile.verificationStatus = status;
    if (status === "rejected") {
      user.roomOwnerProfile.rejectionReason = reason || "No reason provided";
      user.roomOwnerProfile.verifiedAt = undefined;
    } else if (status === "verified") {
      user.roomOwnerProfile.rejectionReason = undefined;
      user.roomOwnerProfile.verifiedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: `Room owner ${status} successfully`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        roomOwnerProfile: user.roomOwnerProfile,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
