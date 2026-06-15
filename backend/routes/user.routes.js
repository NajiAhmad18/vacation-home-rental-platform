// routes/user.routes.js
import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getOverview } from "../controllers/user.controller.js";

const router = express.Router();

// 📊 User Dashboard Overview (protected)
router.get("/overview", verifyToken, getOverview);

export default router;
