import express from "express";
import {
  createPaymentIntent,      // POST   /api/payments/create-intent
  markPaymentSuccess,       // POST   /api/payments/:id/success
  refundPayment,            // POST   /api/payments/:id/refund
  payoutOwner,              // POST   /api/payments/payout
  getLatestPaymentForBooking, // GET  /api/payments/by-booking/:bookingId
  getAllPayments,           // GET    /api/payments (or /api/payments/all)
  getPaymentById,           // GET    /api/payments/:id
  deletePayment,            // DELETE /api/payments/:id
} from "../controllers/payment.controller.js"; // <-- singular
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Stripe intent + lifecycle (protected) */
router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/:id/success",   verifyToken, markPaymentSuccess);
router.post("/:id/refund",    verifyToken, refundPayment);

/* Owner payout (protected) */
router.post("/payout",        verifyToken, payoutOwner);

/* Look up latest payment for a booking (protected) */
router.get("/by-booking/:bookingId", verifyToken, getLatestPaymentForBooking);

/* Listings & details (protected) */
router.get("/all", verifyToken, getAllPayments);
router.get("/",    verifyToken, getAllPayments);
router.get("/:id", verifyToken, getPaymentById);

/* Delete (protected) */
router.delete("/:id", verifyToken, deletePayment);

export default router;
