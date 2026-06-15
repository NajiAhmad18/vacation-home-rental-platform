import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByHomeId,
  cancelBooking,
  getBookingsForOwner,
  getBookingByOwnerId,
  completeBooking,
  activateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";
import {
  verifyToken,
  adminRoute,
  roomOwnerRoute,
  adminOrRoomOwnerRoute,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Create booking (user only)
router.post("/", verifyToken, createBooking);

// Complete booking (room owner or admin)
router.post(
  "/:id/complete",
  verifyToken,
  adminOrRoomOwnerRoute,
  completeBooking
);

// Activate booking (room owner or admin)
router.post(
  "/:id/activate",
  verifyToken,
  adminOrRoomOwnerRoute,
  activateBooking
);

// Get all bookings (admin only)
router.get("/", verifyToken, adminRoute, getAllBookings);

// Get bookings for specific home (public - for date disabling)
router.get("/home/:homeId", getBookingsByHomeId);

// Get bookings for the logged-in owner (roomOwner only)
router.get("/owner", verifyToken, roomOwnerRoute, getBookingsForOwner);

// Specific owner’s bookings (admin or that owner — controller may also check)
router.get("/owner/:id/list", verifyToken, getBookingByOwnerId);

// Cancel booking (user or admin)
router.put("/:id/cancel", verifyToken, cancelBooking);

// Get single booking (user, room owner of home, or admin)
router.get("/:id", verifyToken, getBookingById);

// Delete booking (owner, user, or admin)
router.delete("/:id", verifyToken, deleteBooking);

export default router;
