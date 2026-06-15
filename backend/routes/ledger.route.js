// routes/ledger.routes.js
import { Router } from "express";
import {
  getAdminLedgerBalance,
  getOwnerLedgerBalance,
  createLedgerEntry,
  getOwnerPayouts,
  getAdminRecentActivities,
} from "../controllers/ledger.controller.js";
import {
  verifyToken,
  adminRoute,
  roomOwnerRoute,
  adminOrRoomOwnerRoute,
} from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Admin dashboards (admin only)
 */
router.get("/admin/summary", verifyToken, adminRoute, getAdminLedgerBalance);
router.get("/admin/recent",  verifyToken, adminRoute, getAdminRecentActivities);

/**
 * Owner dashboards
 * Align with controller which allows admin OR roomOwner.
 */
router.get("/owner/summary", verifyToken, adminOrRoomOwnerRoute, getOwnerLedgerBalance);

/**
 * Recent payouts
 * Allow admin OR roomOwner. Make :ownerId optional; controller ignores it for roomOwner.
 */
router.get(
  "/owner/payouts/:ownerId",
  verifyToken,
  adminOrRoomOwnerRoute,
  getOwnerPayouts
);

/**
 * Manual ledger entry (admin only)
 */
router.post("/", verifyToken, adminRoute, createLedgerEntry);

export default router;
