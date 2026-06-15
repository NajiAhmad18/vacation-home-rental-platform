import express from "express";
import multer from "multer";
import {
  createHome,
  getAllHomes,
  getHomeById,
  getHomesByOwner,
  updateHome,
  hideHomeByAdmin,
  toggleHomeAvailability,
  deleteHome,
} from "../controllers/home.controller.js";
import {
  verifyToken,
  roomOwnerRoute,
  adminRoute,
  adminOrRoomOwnerRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// 🏠 Create a new home (owner only)
router.post(
  "/",
  verifyToken,
  roomOwnerRoute,
  upload.array("images", 10),
  createHome
);

// 👤 Get homes for logged-in owner
router.get("/owner", verifyToken, roomOwnerRoute, getHomesByOwner);

// 📋 Get all homes (public)
router.get("/", getAllHomes);

// 🔍 Get a single home by ID (must come last)
router.get("/:id", getHomeById);

// ✏️ Update home details (owner or admin)
router.put(
  "/:id",
  verifyToken,
  adminOrRoomOwnerRoute,
  upload.array("images", 10),
  updateHome
);

// 🚫 Admin hides home
router.put("/admin/hide/:id", verifyToken, adminRoute, hideHomeByAdmin);

// 🕶️ Owner toggles availability
router.put(
  "/owner/toggle-availability/:id",
  verifyToken,
  roomOwnerRoute,
  toggleHomeAvailability
);

// ❌ Delete home (owner or admin)
router.delete("/:id", verifyToken, adminOrRoomOwnerRoute, deleteHome);

export default router;
