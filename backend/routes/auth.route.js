import express from "express";
import {
  signupUser,
  signupRoomOwner,
  login,
  logout,
  getProfile,
  updateProfile,
  verifyRoomOwner,
  uploadProfileImage,
} from "../controllers/auth.controller.js";
import {
  verifyToken,
  roomOwnerRoute,
  adminRoute,
  adminOrRoomOwnerRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Public Routes
 */
router.post("/signup/user", signupUser);
router.post("/signup/roomOwner", signupRoomOwner);
router.post("/login", login);
router.post("/logout", logout);

/**
 * Protected Routes - Any logged in user
 */
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, uploadProfileImage.single("profileImage"), updateProfile);

/**
 * Example: Room Owner-only route
 */
router.get("/roomOwner/dashboard", verifyToken, roomOwnerRoute, (req, res) => {
  res.json({ message: "Room Owner Dashboard", user: req.user });
});

/**
 * Example: Admin-only route
 */
router.get("/admin/dashboard", verifyToken, adminRoute, (req, res) => {
  res.json({ message: "Admin Dashboard", user: req.user });
});

// PUT /api/auth/admin/verify-room-owner/:userId
router.put(
  "/admin/verify-room-owner/:userId",
  verifyToken,
  adminRoute,
  verifyRoomOwner
);

/**
 * Example: Admin or Room Owner route
 */
router.get(
  "/shared/dashboard",
  verifyToken,
  adminOrRoomOwnerRoute,
  (req, res) => {
    res.json({ message: "Admin or Room Owner Dashboard", user: req.user });
  }
);

export default router;
