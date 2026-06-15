// controllers/booking.controller.js
import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import Home from "../models/home.model.js";
import User from "../models/user.model.js";                 // ➕ fetch guest details
import { LedgerEntry } from "../models/ledger.model.js";    // used in completeBooking
import { computeBreakdown } from "../config/fees.js";       // pricing breakdown

/* ========= Helpers ========= */
const nightsBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e - s;
  return ms > 0 ? Math.ceil(ms / 86400000) : 0;
};

const generateBookedDates = (checkIn, checkOut) => {
  const dates = [];
  let d = new Date(checkIn);
  const end = new Date(checkOut);
  while (d < end) {
    dates.push(new Date(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return dates;
};

/* ---------------------------------------------
 * Create a PENDING booking (acts as a hold)
 * Client will navigate to /payment/:bookingId and pay.
 * --------------------------------------------- */
export const createBooking = async (req, res) => {
  try {
    const { homeId, bookedDates, startDate, endDate, guestName, phone, idCard } = req.body;
    const userId = req.user?._id; // from auth middleware

    // Required fields (guest details come from user profile)
    if (!homeId || !startDate || !endDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Load home & compute pricing
    const home = await Home.findById(homeId).select("price ownerId");
    if (!home) return res.status(404).json({ message: "Home not found" });

    const nights = nightsBetween(startDate, endDate);
    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid date range" });
    }
    const breakdown = computeBreakdown(home.price, nights); // { base, cleaning, service, taxes, total, nightly, nights }

    // Availability (respect active/completed and non-expired pending holds)
    const now = new Date();
    const overlap = await Booking.findOne({
      homeId,
      checkInDate: { $lt: new Date(endDate) },
      checkOutDate: { $gt: new Date(startDate) },
      $or: [
        { status: { $in: ["active", "completed"] } },
        { status: "pending", expiresAt: { $gt: now } },
      ],
    }).select("_id checkInDate checkOutDate status");

    if (overlap) {
      const reason = overlap.status === "pending" ? "being held for payment" : "already booked";
      return res.status(409).json({ message: `Selected dates are ${reason}` });
    }

    // Create pending hold with TTL
    const ttlMinutes = 10;
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const nightsArray =
      Array.isArray(bookedDates) && bookedDates.length
        ? bookedDates.map((d) => new Date(d))
        : generateBookedDates(startDate, endDate);

    const booking = await Booking.create({
      homeId,
      userId,
      bookedDates: nightsArray,
      checkInDate: new Date(startDate),
      checkOutDate: new Date(endDate),
      totalPrice: breakdown.total, // includes fees
      currency: "lkr",
      status: "pending",      // hold until payment succeeds
      expiresAt,              // TTL anchor: ensure schema has TTL index
      paymentStatus: "none",  // optional field in schema
      fullName: guestName,
      phoneNumber: phone,
      idCard,
    });

    // ⚠️ Do NOT create escrow ledger here. Do it after payment confirmation (e.g., webhook).

    return res.status(201).json({
      message: "Pending booking (hold) created",
      data: booking,
      breakdown,
      ttlSeconds: ttlMinutes * 60,
      expiresAt,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* 📋 Get all bookings (admin only) */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("homeId", "title price location");
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* 📋 Get booking by ID (auth: booking owner, admin, or home owner) */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("homeId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      String(booking.userId) !== String(req.user._id) &&
      req.user.role !== "admin" &&
      String(booking.homeId.ownerId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Unauthorized to view this booking" });
    }

    res.json({ data: booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* 📋 Get booked nights for a home (calendar disable) */
export const getBookingsByHomeId = async (req, res) => {
  try {
    const now = new Date();
    const bookings = await Booking.find({
      homeId: req.params.homeId,
      $or: [
        { status: { $in: ["active", "completed"] } },
        { status: "pending", expiresAt: { $gt: now } },
      ],
    }).select("bookedDates -_id");

    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ❌ Cancel booking (user or admin) */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      String(booking.userId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    booking.status = "cancelled";
    booking.refundReason = req.body.refundReason || "No reason provided";
    booking.expiresAt = undefined; // prevent TTL acting on an already-cancelled record
    await booking.save();

    res.json({ message: "Booking cancelled successfully", data: booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ✅ Complete booking (owner or admin) */
export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("homeId");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.status === "completed") {
      return res.status(400).json({ success: false, message: "Booking already completed" });
    }

    if (
      String(booking.homeId.ownerId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to complete this booking",
      });
    }

    const commissionRate = 0.1;
    const commissionAmount = booking.totalPrice * commissionRate;
    const payoutToOwner = booking.totalPrice - commissionAmount;
    const ownerId = booking.homeId.ownerId;

    // Payout to owner
    await LedgerEntry.create({
      bookingId: booking._id,
      ownerId,
      type: "payout_owner",
      debit: 0,
      credit: payoutToOwner,
      accounts: { from: "escrow_account", to: "owner_wallet" },
      note: "Owner payout after successful checkout",
    });

    // Commission income to platform
    await LedgerEntry.create({
      bookingId: booking._id,
      type: "commission_income",
      debit: 0,
      credit: commissionAmount,
      accounts: { from: "escrow_account", to: "platform_wallet" },
      note: "Commission collected by platform",
    });

    booking.status = "completed";
    await booking.save();

    res.json({ success: true, booking, payoutToOwner, commissionAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to complete booking" });
  }
};

/* ✅ Activate booking (guests checked in) */
export const activateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("homeId");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be activated",
      });
    }

    if (
      String(booking.homeId.ownerId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to activate this booking",
      });
    }

    booking.status = "active";
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to activate booking" });
  }
};

/* 📋 Get bookings for logged-in owner (roomOwner only) */
export const getBookingsForOwner = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const homes = await Home.find({ ownerId }).select("_id");

    if (!homes.length) {
      return res.status(404).json({ message: "No homes found for this owner" });
    }

    const homeIds = homes.map((h) => h._id);
    const bookings = await Booking.find({ homeId: { $in: homeIds } })
      .populate("homeId", "title location price")
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (err) {
    console.error("getBookingsForOwner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* 📋 Get bookings by explicit Owner ID (admin/owner dashboards) */
export const getBookingByOwnerId = async (req, res) => {
  try {
    const { id: ownerId } = req.params;
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const homes = await Home.find({ ownerId: ownerObjectId }).select("_id");
    if (!homes.length) {
      return res.status(404).json({ message: "No homes found for this owner" });
    }

    const homeIds = homes.map((h) => h._id);

    const bookings = await Booking.find({ homeId: { $in: homeIds } })
      .populate("homeId", "title location price")
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (err) {
    console.error("getBookingByOwnerId error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ❌ Delete booking (owner of home, booking owner, or admin) */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("homeId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (
      String(booking.userId) !== String(req.user._id) &&
      String(booking.homeId.ownerId) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this booking",
      });
    }

    await booking.deleteOne();
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};
