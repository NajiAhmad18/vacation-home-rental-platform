import express from "express";
import {
  addReview,
  getReviewsByBooking,
  deleteReview,
  getReviewsByHomeId,
  replyToReview,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add review (user only)
router.post("/:bookingId", verifyToken, addReview);

// Get reviews for a home
router.get("/home/:homeId", getReviewsByHomeId);

// Get reviews for a booking
router.get("/booking/:bookingId", getReviewsByBooking);

// Owner reply to review
router.put("/:reviewId/reply", verifyToken, replyToReview);

// Delete review
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
