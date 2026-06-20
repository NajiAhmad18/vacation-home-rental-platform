// routes/user.routes.js
import express from "express";
import { verifyToken, adminRoute } from "../middleware/auth.middleware.js";
import {
  getOverview,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/user.controller.js";

const router = express.Router();

// 📊 User Dashboard Overview (protected)
router.get("/overview", verifyToken, getOverview);

// 👮 Admin-only user management routes
router.get("/", verifyToken, adminRoute, getAllUsers);
router.delete("/:id", verifyToken, adminRoute, deleteUser);
router.put("/:id/role", verifyToken, adminRoute, updateUserRole);

export default router;
