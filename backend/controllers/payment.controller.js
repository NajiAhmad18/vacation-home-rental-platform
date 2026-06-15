// controllers/payment.controller.js
import Stripe from "stripe";
import { Payment } from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import Home from "../models/home.model.js";
import User from "../models/user.model.js";
import { createLedgerEntryService } from "./ledger.controller.js";
import { generateInvoice } from "../utils/generateInvoice.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ---------- helpers ---------- */
const toMinorUnits = (amount) => Math.round(Number(amount || 0) * 100);
const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;

const toUTCMidnight = (d) => {
  const x = new Date(d);
  return Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
};

const nightsBetween = (ci, co) => {
  const ms = toUTCMidnight(co) - toUTCMidnight(ci);
  return ms > 0 ? Math.round(ms / 86400000) : 0;
};

const generateBookedDates = (checkIn, checkOut) => {
  const out = [];
  let d = new Date(checkIn);
  const end = new Date(checkOut);
  while (d < end) {
    out.push(new Date(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
};

const toYMD = (date) => new Date(date).toISOString().slice(0, 10);

// ⚠️ Default fee schedule in **LKR** (tune to your business rules)
// You can also store these per-booking to make them immutable once set.
const FEES = Object.freeze({
  cleaning: 0,  // e.g., 1500
  service: 0,   // e.g., 1200
  taxes: 0,     // e.g., 1800
});

/* ============================================================
 * POST /api/payments/create-intent
 * ============================================================ */
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: "bookingId is required" });

    // 1) Load booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status !== "pending") {
      return res.status(409).json({ error: "Booking is not pending" });
    }
    if (booking.expiresAt && booking.expiresAt <= new Date()) {
      return res.status(410).json({ error: "Booking hold expired" });
    }

    // 2) Owner
    const home = await Home.findById(booking.homeId).select("ownerId price");
    if (!home) return res.status(404).json({ error: "Home not found for booking" });
    if (!home.ownerId) return res.status(400).json({ error: "Home has no ownerId" });

    // 2.5) Fetch user email for Stripe receipts (best-effort)
    let receiptEmail;
    try {
      if (booking.userId) {
        const u = await User.findById(booking.userId).select("email");
        receiptEmail = u?.email || undefined;
      }
    } catch {}

    // 3) Compute amount (with fees) in **LKR**
    const nights = nightsBetween(booking.checkInDate, booking.checkOutDate);
    const nightly = Number(home.price || 0);
    const base = nightly * nights;

    // Use existing booking totalPrice if set, else derive from FEES
    let cleaningFee = Number(booking.feeCleaning ?? FEES.cleaning);
    let serviceFee = Number(booking.feeService ?? FEES.service);
    let taxAmount = Number(booking.feeTax ?? FEES.taxes);

    let amountLkr = Number(booking.totalPrice || 0);
    let currency = (booking.currency || "lkr").toLowerCase();

    if (!Number.isFinite(amountLkr) || amountLkr <= 0) {
      amountLkr = base + cleaningFee + serviceFee + taxAmount;
      booking.totalPrice = amountLkr;
      // Persist fees used for this booking to make them immutable
      booking.feeCleaning = cleaningFee;
      booking.feeService = serviceFee;
      booking.feeTax = taxAmount;
      await booking.save();
    } else {
      // If totalPrice was preset, ensure fee fields are persisted for consistency
      if (booking.feeCleaning == null) booking.feeCleaning = cleaningFee;
      if (booking.feeService == null) booking.feeService = serviceFee;
      if (booking.feeTax == null) booking.feeTax = taxAmount;
      await booking.save();
    }

    // 4) Create PaymentIntent (Stripe expects minor units)
    const pi = await stripe.paymentIntents.create({
      amount: toMinorUnits(amountLkr),
      currency, // "lkr"
      automatic_payment_methods: { enabled: true },
      receipt_email: receiptEmail, // only sent if defined
      metadata: { bookingId: String(bookingId), homeId: String(booking.homeId) },
    });

    // 5) Persist PI info
    booking.paymentIntentId = pi.id;
    booking.paymentStatus = "processing";
    await booking.save();

    // Store fees now so they’re visible before capture succeeds
    const payment = await Payment.create({
      bookingId,
      ownerId: home.ownerId,
      provider: "stripe",
      providerPaymentId: pi.id,
      status: "pending",
      amount: round2(amountLkr),
      currency,
      method: "card",
      // Breakdown fields (finalized on success too)
      baseAmount: round2(base),
      cleaningFee: round2(cleaningFee),
      serviceFee: round2(serviceFee),
      taxAmount: round2(taxAmount),
      commission: 0,
      payoutAmount: 0,
      ownerPayoutTotal: 0,
      platformRevenueTotal: 0,
    });

    return res.json({
      clientSecret: pi.client_secret,
      paymentId: payment._id,
      amount: round2(amountLkr),
      currency,
    });
  } catch (err) {
    console.error("createPaymentIntent error:", err);
    return res.status(500).json({ error: err.message || "Failed to create payment intent" });
  }
};


/* ============================================================
 * POST /api/payments/:id/success
 * ============================================================ */
export const markPaymentSuccess = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    if (!payment.providerPaymentId) {
      return res.status(400).json({ error: "Missing providerPaymentId on Payment" });
    }

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) return res.status(404).json({ error: "Linked booking not found" });

    // Idempotent path
    if (booking.status === "active" && payment.status === "succeeded") {
      let receiptUrl = payment.receiptUrl ?? null;
      if (!receiptUrl) {
        try {
          const pi = await stripe.paymentIntents.retrieve(payment.providerPaymentId, { expand: ["latest_charge"] });
          if (pi?.latest_charge && typeof pi.latest_charge === "object") {
            receiptUrl = pi.latest_charge.receipt_url || null;
          }
        } catch {}
      }
      return res.json({
        ok: true,
        status: "succeeded",
        bookingId: String(booking._id),
        paymentId: String(payment._id),
        invoiceUrl: payment.invoiceUrl ?? null,
        receiptUrl,
      });
    }

    if (booking.status !== "pending" && booking.status !== "active") {
      return res.status(409).json({ error: `Booking not in confirmable state (${booking.status})` });
    }

    // Verify with Stripe
    const pi = await stripe.paymentIntents.retrieve(payment.providerPaymentId, { expand: ["latest_charge"] });
    if (pi.status !== "succeeded") {
      return res.status(400).json({ error: `PaymentIntent not succeeded (${pi.status})` });
    }

    // Stripe receipt URL (if any)
    let receiptUrl = null;
    if (pi.latest_charge && typeof pi.latest_charge === "object") {
      receiptUrl = pi.latest_charge.receipt_url || null;
    } else {
      const chargeId = pi.latest_charge || pi.charges?.data?.[0]?.id;
      if (chargeId) {
        try {
          const charge = await stripe.charges.retrieve(chargeId);
          receiptUrl = charge?.receipt_url || null;
        } catch {}
      }
    }

    // Confirm booking atomically
    const bookedDates = generateBookedDates(booking.checkInDate, booking.checkOutDate);
    await Booking.updateOne(
      { _id: booking._id },
      {
        $set: { bookedDates, status: "active", paidAt: new Date(), paymentStatus: "paid" },
        $unset: { expiresAt: "" },
      }
    );
    await Home.updateOne(
      { _id: booking.homeId },
      { $addToSet: { bookedDates: { $each: bookedDates.map(toYMD) } } }
    );

    /* ---------------- Breakdown (commission = 10% of gross) ---------------- */
    const gross = round2(Number(payment.amount || booking.totalPrice || 0));

    // Persisted fees on Payment/Booking, else defaults
    const cleaningFee = round2(Number(payment.cleaningFee ?? booking.feeCleaning ?? FEES.cleaning));
    const serviceFee  = round2(Number(payment.serviceFee  ?? booking.feeService  ?? FEES.service));
    const taxAmount   = round2(Number(payment.taxAmount   ?? booking.feeTax      ?? FEES.taxes));

    // Base nightly revenue derived from gross minus explicit fees
    const base = round2(gross - (cleaningFee + serviceFee + taxAmount));

    // Commission is 10% of the total amount (gross)
    const commissionRate = 0.10;
    const commission = round2(gross * commissionRate);

    // Base after commission (for bookkeeping)
    const payoutOnBase = round2(base - commission);

    // Owner: base-after-commission + cleaning + tax  == gross - (commission + service)
    const ownerPayoutTotal = round2(payoutOnBase + cleaningFee + taxAmount);

    // Platform: commission + service fee
    const platformRevenueTotal = round2(commission + serviceFee);

    // Sanity check (allow tiny rounding drift)
    const drift = round2(gross - (ownerPayoutTotal + platformRevenueTotal));
    if (Math.abs(drift) >= 0.02) {
      console.warn("Payment breakdown drift:", { drift, gross, ownerPayoutTotal, platformRevenueTotal });
    }

    // Save status + breakdown (+ persist URLs)
    payment.status = "succeeded";
    payment.commission = commission;
    payment.payoutAmount = payoutOnBase;            // base-after-commission
    payment.cleaningFee = cleaningFee;
    payment.serviceFee = serviceFee;
    payment.taxAmount = taxAmount;
    payment.ownerPayoutTotal = ownerPayoutTotal;
    payment.platformRevenueTotal = platformRevenueTotal;
    payment.receiptUrl = receiptUrl || payment.receiptUrl || null;

    // Ledger: capture into escrow
    await createLedgerEntryService({
      bookingId: booking._id,
      type: "payment_capture",
      debit: 0,
      credit: gross,
      currency: (payment.currency || booking.currency || "lkr").toUpperCase(),
      accounts: { from: "user_wallet", to: "escrow_account" },
      note: `Payment ${payment._id} captured successfully`,
    });

    // Invoice URL
    let invoiceUrl = null;
    try {
      const homeDoc = await Home.findById(booking.homeId).select("title");
      const inv = await generateInvoice({ booking, payment, home: homeDoc });
      const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      invoiceUrl = `${baseUrl}/invoices/${inv.filename}`;
      payment.invoiceUrl = invoiceUrl;
    } catch (e) {
      console.error("generateInvoice failed:", e.message);
    }

    await payment.save();

    return res.json({
      ok: true,
      status: "succeeded",
      bookingId: String(booking._id),
      paymentId: String(payment._id),
      invoiceUrl,
      receiptUrl,
      breakdown: {
        gross,
        base,
        fees: { cleaning: cleaningFee, service: serviceFee, tax: taxAmount },
        owner: {
          baseAfterCommission: payoutOnBase,
          cleaning: cleaningFee,
          tax: taxAmount,
          total: ownerPayoutTotal,
        },
        platform: {
          commission,
          serviceFee,
          total: platformRevenueTotal,
        },
        drift,
      },
    });
  } catch (err) {
    console.error("markPaymentSuccess error:", err);
    return res.status(500).json({ error: err.message || "Failed to finalize payment" });
  }
};


/* ============================================================
 * POST /api/payments/:id/refund
 * ============================================================ */
export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    await stripe.refunds.create({ payment_intent: payment.providerPaymentId });

    payment.status = "refunded";
    await payment.save();

    // Ledger: refund is an OUTFLOW from escrow → record as CREDIT with accounts.from=escrow_account
    await createLedgerEntryService({
      bookingId: payment.bookingId,
      type: "refund",
      debit: 0,
      credit: payment.amount,
      currency: (payment.currency || "lkr").toUpperCase(),
      accounts: { from: "escrow_account", to: "user_wallet" },
      note: `Refund issued for payment ${payment._id}`,
    });

    return res.json({ ok: true, status: "refunded", payment });
  } catch (err) {
    console.error("refundPayment error:", err);
    return res.status(500).json({ error: err.message || "Failed to refund payment" });
  }
};

/* ============================================================
 * POST /api/payments/payout
 * ============================================================ */
export const payoutOwner = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    if (payment.status !== "succeeded") {
      return res.status(400).json({ error: "Payment is not succeeded yet" });
    }
    if (!payment.ownerId) {
      return res.status(400).json({ error: "Payment missing ownerId" });
    }

    const { ownerId, bookingId, payoutAmount, commission, currency } = payment;

    // Payout to owner → CREDIT out of escrow
    const payoutEntry = await createLedgerEntryService({
      bookingId,
      type: "payout_owner",
      debit: 0,
      credit: payoutAmount,
      currency: (currency || "lkr").toUpperCase(),
      accounts: { from: "escrow_account", to: "owner_wallet" },
      ownerId,
      note: `Payout of ${payoutAmount} to owner ${ownerId} for booking ${bookingId}`,
    });

    // Platform revenue → CREDIT out of escrow to platform wallet
    const commissionEntry = await createLedgerEntryService({
      bookingId,
      type: "commission_income",
      debit: 0,
      credit: commission,
      currency: (currency || "lkr").toUpperCase(),
      accounts: { from: "escrow_account", to: "platform_wallet" },
      note: `Commission income from booking ${bookingId}`,
    });

    payment.status = "payout_completed";
    await payment.save();

    return res.json({
      ok: true,
      status: "payout_completed",
      payoutEntry,
      commissionEntry,
      payment,
    });
  } catch (err) {
    console.error("payoutOwner error:", err);
    return res.status(500).json({ error: err.message || "Failed to process payout" });
  }
};

/* ============================================================
 * GET /api/payments/by-booking/:bookingId
 * ============================================================ */
export const getLatestPaymentForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) return res.status(400).json({ error: "bookingId is required" });

    const payment = await Payment.findOne({ bookingId }).sort({ createdAt: -1 });
    if (!payment) return res.status(404).json({ error: "No payment found for booking" });

    return res.json({
      paymentId: String(payment._id),
      status: payment.status,
      provider: payment.provider,
      providerPaymentId: payment.providerPaymentId, // "pi_..."
      amount: payment.amount,
      currency: payment.currency,
      breakdown: {
        baseAmount: round2(payment.baseAmount ?? 0),
        cleaningFee: round2(payment.cleaningFee ?? 0),
        serviceFee: round2(payment.serviceFee ?? 0),
        taxAmount: round2(payment.taxAmount ?? 0),
        commission: round2(payment.commission ?? 0),
        payoutOnBase: round2(payment.payoutAmount ?? 0),
        ownerPayoutTotal: round2(
          payment.ownerPayoutTotal ??
          ((payment.payoutAmount ?? 0) + (payment.cleaningFee ?? 0) + (payment.taxAmount ?? 0))
        ),
        platformRevenueTotal: round2(
          payment.platformRevenueTotal ??
          ((payment.commission ?? 0) + (payment.serviceFee ?? 0))
        ),
      },
    });
  } catch (err) {
    console.error("getLatestPaymentForBooking error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch payment" });
  }
};

/* ============================================================
 * GET /api/payments (admin)
 * ============================================================ */
export const getAllPayments = async (req, res) => {
  try {
    const page  = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const sort  = String(req.query.sort || "-createdAt");

    const [items, total] = await Promise.all([
      Payment.find()
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "bookingId",
          select: "fullName phoneNumber checkInDate checkOutDate totalPrice currency homeId",
          populate: [{ path: "homeId", select: "title price location address ownerId" }],
        })
        .lean(),
      Payment.countDocuments(),
    ]);

    const data = items.map((p) => {
      const b = p.bookingId || {};
      const h = b.homeId || {};
      return {
        paymentId: String(p._id),
        status: p.status,
        provider: p.provider,
        providerPaymentId: p.providerPaymentId,
        amount: p.amount,
        currency: (p.currency || "lkr").toUpperCase(),
        createdAt: p.createdAt,
        paidAt: p.paidAt || null,
        booking: {
          id: b?._id ? String(b._id) : null,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          totalPrice: b.totalPrice,
          currency: (b.currency || "lkr").toUpperCase(),
        },
        guest: { name: b.fullName || null, email: null }, // email lives on User; omit if not available
        home:  {
          id: h?._id ? String(h._id) : null,
          title: h.title,
          price: h.price,
          location: h.location,
          address: h.address,
          ownerId: h.ownerId ? String(h.ownerId) : null,
        },
        invoiceUrl: p.invoiceUrl || null,
        receiptUrl: p.receiptUrl || null,
      };
    });

    res.json({
      data,
      meta: { page, limit, total, hasMore: page * limit < total },
    });
  } catch (err) {
    console.error("getAllPayments error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch payments" });
  }
};

/* ============================================================
 * GET /api/payments/:id (admin)
 * ============================================================ */
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const p = await Payment.findById(id)
      .populate({
        path: "bookingId",
        select: "fullName phoneNumber checkInDate checkOutDate totalPrice currency homeId userId paidAt feeCleaning feeService feeTax",
        populate: [
          { path: "homeId", select: "title price location address ownerId" },
          { path: "userId", select: "name email phone" },
        ],
      })
      .lean();

    if (!p) return res.status(404).json({ error: "Payment not found" });

    const b = p.bookingId || {};
    const h = b.homeId || {};
    const u = b.userId || {};

    // -------- Breakdown (commission = 10% of gross) --------
    const gross = round2(Number(p.amount ?? b.totalPrice ?? 0));
    const cleaningFee = round2(Number(p.cleaningFee ?? b.feeCleaning ?? FEES.cleaning));
    const serviceFee  = round2(Number(p.serviceFee  ?? b.feeService  ?? FEES.service));
    const taxAmount   = round2(Number(p.taxAmount   ?? b.feeTax      ?? FEES.taxes));

    // Derive base from gross minus explicit fees
    const base = round2(gross - (cleaningFee + serviceFee + taxAmount));

    const commissionRate = 0.10;
    const commission = round2(gross * commissionRate);

    // Base after commission (for reference)
    const payoutOnBase = round2(base - commission);

    // Owner takes base-after-commission + cleaning + tax  == gross - (commission + service)
    const ownerPayoutTotal = round2(payoutOnBase + cleaningFee + taxAmount);

    // Platform = commission + service
    const platformRevenueTotal = round2(commission + serviceFee);

    const drift = round2(gross - (ownerPayoutTotal + platformRevenueTotal));

    // Try to surface Stripe receipt (best-effort)
    let receiptUrl = p.receiptUrl || null;
    if (!receiptUrl && p.providerPaymentId) {
      try {
        const pi = await stripe.paymentIntents.retrieve(p.providerPaymentId, { expand: ["latest_charge"] });
        if (pi?.latest_charge && typeof pi.latest_charge === "object") {
          receiptUrl = pi.latest_charge.receipt_url || null;
        } else {
          const chargeId = pi.latest_charge || pi.charges?.data?.[0]?.id;
          if (chargeId) {
            const charge = await stripe.charges.retrieve(chargeId);
            receiptUrl = charge?.receipt_url || null;
          }
        }
      } catch {}
    }

    return res.json({
      ok: true,
      data: {
        paymentId: String(p._id),
        status: p.status,
        provider: p.provider,
        providerPaymentId: p.providerPaymentId,
        amount: gross,
        currency: (p.currency || "lkr").toUpperCase(),
        method: p.method || "card",
        createdAt: p.createdAt,
        paidAt: p.paidAt || b.paidAt || null,

        booking: {
          id: b?._id ? String(b._id) : null,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          totalPrice: b.totalPrice,
          currency: (b.currency || "lkr").toUpperCase(),
        },
        guest: {
          name: b.fullName || u.name || null,
          email: u.email || null,
          phone: b.phoneNumber || u.phone || null,
        },
        home: {
          id: h?._id ? String(h._id) : null,
          title: h.title,
          price: h.price,
          location: h.location,
          address: h.address,
          ownerId: h.ownerId ? String(h.ownerId) : null,
        },

        invoiceUrl: p.invoiceUrl || null,
        receiptUrl,

        breakdown: {
          gross,
          base,
          fees: { cleaning: cleaningFee, service: serviceFee, tax: taxAmount },
          owner: {
            baseAfterCommission: payoutOnBase,
            cleaning: cleaningFee,
            tax: taxAmount,
            total: ownerPayoutTotal,
          },
          platform: {
            commission,
            serviceFee,
            total: platformRevenueTotal,
          },
          drift,
        },
      },
    });
  } catch (err) {
    console.error("getPaymentById error:", err);
    return res.status(500).json({ error: err.message || "Failed to fetch payment" });
  }
};

/* ============================================================
 * DELETE /api/payments/:id
 *  - Delete only if not captured / not payout completed
 *  - Cancel Stripe PaymentIntent if possible
 *  - Clean booking's hold references for pending flows
 * ============================================================ */
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const hard = String(req.query.hard || "").toLowerCase() === "1" || String(req.query.hard || "").toLowerCase() === "true";

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    // Prevent deleting money-moving records
    if (["succeeded", "payout_completed"].includes(payment.status)) {
      return res.status(409).json({ error: "Cannot delete a captured/payout-completed payment. Issue a refund instead." });
    }
    if (payment.status === "refunded" && !hard) {
      return res.status(409).json({ error: "Payment is refunded; use ?hard=1 to purge (not recommended)." });
    }

    // Best-effort: cancel PI if still cancelable
    if (payment.providerPaymentId) {
      try {
        await stripe.paymentIntents.cancel(payment.providerPaymentId);
      } catch {
        // Ignore if PI is already succeeded/canceled or not cancelable
      }
    }

    // Clean booking refs for holds (if booking still pending)
    if (payment.bookingId) {
      try {
        const booking = await Booking.findById(payment.bookingId);
        if (booking && booking.status === "pending") {
          await Booking.updateOne(
            { _id: booking._id },
            { $unset: { paymentIntentId: "", paymentStatus: "" } }
          );
        }
      } catch {}
    }

    await Payment.deleteOne({ _id: id });

    return res.json({ ok: true, deletedId: String(id) });
  } catch (err) {
    console.error("deletePayment error:", err);
    return res.status(500).json({ error: err.message || "Failed to delete payment" });
  }
};
