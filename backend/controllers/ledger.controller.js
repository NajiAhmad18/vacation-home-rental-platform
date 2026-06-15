// controllers/ledger.controller.js
import mongoose from "mongoose";
import { LedgerEntry } from "../models/ledger.model.js";

/* ---------------- helpers: role checks tied to auth.middleware.js ---------------- */
const ensureAuthed = (req, res) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return false;
  }
  return true;
};

const ensureRole = (req, res, ...allowed) => {
  if (!ensureAuthed(req, res)) return false;
  if (!allowed.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: `Access denied - requires one of: ${allowed.join(", ")}`,
    });
    return false;
  }
  return true;
};

/**
 * createLedgerEntryService
 * Keep in sync with LedgerEntry.type enum:
 *   - payment_capture     // money captured from customer into escrow
 *   - payout_owner        // payout from escrow to owner wallet
 *   - commission_income   // platform income (from escrow to platform wallet)
 *   - refund              // refund flow (usually from escrow back to customer)
 *   - adjustment          // manual adjustments
 *
 * Notes on credit/debit conventions used across the app:
 * - Your Booking.completeBooking() creates entries with debit: 0 and credit > 0.
 * - "Where the money goes" is represented by `accounts.to` (credited).
 * - Escrow balance therefore is:
 *      sum(credit where accounts.to == "escrow_account")
 *    - sum(credit where accounts.from == "escrow_account")
 */
export const createLedgerEntryService = async (data) => {
  const {
    bookingId,
    type,
    debit = 0,
    credit = 0,
    currency = "LKR",
    accounts,          // { from: "accountName", to: "accountName" }
    ownerId,           // required for payout_owner
    note,
  } = data;

  if (!bookingId || !type || !accounts || !accounts.from || !accounts.to) {
    throw new Error("Missing required fields for ledger entry");
  }

  const ledgerEntryData = {
    bookingId,
    type,
    debit,
    credit,
    currency,
    accounts,
    note,
  };

  if (type === "payout_owner" && ownerId) {
    ledgerEntryData.ownerId = new mongoose.Types.ObjectId(ownerId);
  }

  return await LedgerEntry.create(ledgerEntryData);
};

/* ======================
 * 🔹 Admin Dashboard (ADMIN ONLY)
 * ====================== */
export const getAdminLedgerBalance = async (req, res) => {
  if (!ensureRole(req, res, "admin")) return;
  try {
    const [escrowAgg] = await LedgerEntry.aggregate([
      {
        $group: {
          _id: null,
          creditsIntoEscrow: {
            $sum: {
              $cond: [{ $eq: ["$accounts.to", "escrow_account"] }, "$credit", 0],
            },
          },
          creditsOutOfEscrow: {
            $sum: {
              $cond: [{ $eq: ["$accounts.from", "escrow_account"] }, "$credit", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          balance: { $subtract: ["$creditsIntoEscrow", "$creditsOutOfEscrow"] },
        },
      },
    ]);

    const [platformAgg] = await LedgerEntry.aggregate([
      { $match: { type: "commission_income" } },
      { $group: { _id: null, total: { $sum: "$credit" } } },
      { $project: { _id: 0, total: 1 } },
    ]);

    res.json({
      success: true,
      escrowBalance: escrowAgg?.balance || 0,
      totalCommission: platformAgg?.total || 0,
    });
  } catch (err) {
    console.error("getAdminLedgerBalance error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin dashboard" });
  }
};

/* ======================
 * 🔹 Owner Dashboard (ROOM OWNER or ADMIN)
 *  - roomOwner: always their own balance (ignore param if provided)
 *  - admin: can query any owner via :ownerId or fallback to auth user if admin happens to be an owner too
 * ====================== */
export const getOwnerLedgerBalance = async (req, res) => {
  if (!ensureRole(req, res, "roomOwner", "admin")) return;
  try {
    let ownerIdStr;

    if (req.user.role === "roomOwner") {
      ownerIdStr = req.user._id?.toString();
    } else {
      // admin
      ownerIdStr = req.params?.ownerId || req.user?._id?.toString();
    }

    if (!ownerIdStr) {
      return res
        .status(400)
        .json({ success: false, message: "Owner ID is required" });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerIdStr);

    const [earnings] = await LedgerEntry.aggregate([
      { $match: { type: "payout_owner", ownerId: ownerObjectId } },
      { $group: { _id: null, totalEarnings: { $sum: "$credit" } } },
      { $project: { _id: 0, totalEarnings: 1 } },
    ]);

    res.json({
      success: true,
      totalEarnings: earnings?.totalEarnings || 0,
    });
  } catch (err) {
    console.error("getOwnerLedgerBalance error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch owner dashboard" });
  }
};

/* ======================
 * 🔹 Manual Ledger Entry (ADMIN ONLY)
 * ====================== */
export const createLedgerEntry = async (req, res) => {
  if (!ensureRole(req, res, "admin")) return;
  try {
    const data = {
      ...req.body,
      currency: req.body?.currency || "LKR",
    };
    const ledgerEntry = await createLedgerEntryService(data);
    res.status(201).json({
      success: true,
      message: "Ledger entry created successfully",
      ledgerEntry,
    });
  } catch (err) {
    console.error("createLedgerEntry error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================
 * 🔹 Recent Owner Payouts (ROOM OWNER or ADMIN)
 *  - roomOwner: only their own payouts (param ignored)
 *  - admin: can query any owner via :ownerId or fallback to auth user
 * ====================== */
export const getOwnerPayouts = async (req, res) => {
  if (!ensureRole(req, res, "roomOwner", "admin")) return;
  try {
    let ownerIdStr;

    if (req.user.role === "roomOwner") {
      ownerIdStr = req.user._id?.toString();
    } else {
      // admin
      ownerIdStr = req.params?.ownerId || req.user?._id?.toString();
    }

    if (!ownerIdStr) {
      return res
        .status(400)
        .json({ success: false, message: "OwnerId is required" });
    }

    const payouts = await LedgerEntry.find({
      type: "payout_owner",
      ownerId: new mongoose.Types.ObjectId(ownerIdStr),
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, data: payouts });
  } catch (err) {
    console.error("getOwnerPayouts error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch payouts" });
  }
};

/* ======================
 * 🔹 Admin Recent Activities (ADMIN ONLY)
 * ====================== */
export const getAdminRecentActivities = async (req, res) => {
  if (!ensureRole(req, res, "admin")) return;
  try {
    const activities = await LedgerEntry.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: activities });
  } catch (err) {
    console.error("getAdminRecentActivities error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recent activities" });
  }
};
