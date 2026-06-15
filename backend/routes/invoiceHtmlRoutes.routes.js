// routes/invoiceHtml.route.js 
import express from "express";
import { Payment } from "../models/payment.model.js";
import Booking from "../models/booking.model.js";
import Home from "../models/home.model.js";

const router = express.Router();

// Business branding (adjust as you like)
const BRAND = {
  name: "RentHub",
  supportEmail: "renthub@gmail.com",   // put your test email here
  supportPhone: "+94 77 000 0000",
  address1: "123 Beach Road",
  address2: "Colombo, Sri Lanka",
};

const fmtMoney = (n, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(Number(n || 0));

router.get("/invoices/html/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).send("Payment not found");

    const booking = await Booking.findById(payment.bookingId);
    if (!booking) return res.status(404).send("Linked booking not found");

    const home = await Home.findById(booking.homeId).select("title address price");

    // currency/amount
    const currency = (payment.currency || booking.currency || "usd").toUpperCase();
    const total = booking?.totalPrice ?? payment?.amount ?? 0;

    // Bill To: use real guest name if present
    const guestName =
      booking.guestName ||
      booking.guest?.name ||
      booking.name ||
      booking.customerName ||
      "Guest";
    const guestEmail =
      booking.guestEmail || booking.guest?.email || booking.email || "";

    const invoiceNo = `RH-${new Date().getFullYear()}-${String(payment._id).slice(-6).toUpperCase()}`;
    const issued = new Date().toISOString().slice(0, 10);

    // Tailwind via CDN; printable page with a “Download / Print” button
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${invoiceNo} — ${BRAND.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body class="bg-slate-100 text-slate-900">
  <div class="max-w-4xl mx-auto my-10 bg-white shadow-sm rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="px-8 py-6 border-b border-slate-200 flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">${BRAND.name}</h1>
        <p class="text-sm text-slate-600 mt-1">${BRAND.address1}</p>
        <p class="text-sm text-slate-600">${BRAND.address2}</p>
        <p class="text-sm text-slate-600 mt-1">${BRAND.supportEmail} ${BRAND.supportPhone ? " • " + BRAND.supportPhone : ""}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-semibold">INVOICE</p>
        <p class="text-sm text-slate-600 mt-1">Invoice #: <span class="font-medium">${invoiceNo}</span></p>
        <p class="text-sm text-slate-600">Date: <span class="font-medium">${issued}</span></p>
        <button onclick="window.print()" class="no-print mt-3 inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-white text-sm hover:bg-slate-800">
          Print / Save PDF
        </button>
      </div>
    </div>

    <!-- Parties -->
    <div class="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 class="text-sm font-semibold text-slate-700">Bill To</h2>
        <p class="mt-2 font-medium">${guestName}</p>
        ${guestEmail ? `<p class="text-sm text-slate-600">${guestEmail}</p>` : ""}
      </div>
      <div class="md:text-right">
        <h2 class="text-sm font-semibold text-slate-700">Property</h2>
        <p class="mt-2 font-medium">${home?.title ?? "Property"}</p>
        ${home?.address ? `<p class="text-sm text-slate-600">${home.address}</p>` : ""}
      </div>
    </div>

    <!-- Booking details -->
    <div class="px-8">
      <div class="rounded-xl border border-slate-200 overflow-hidden">
        <div class="bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700">Booking Details</div>
        <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span class="text-slate-500">Booking ID:</span> <span class="font-medium">${String(booking._id)}</span></div>
          <div><span class="text-slate-500">Status:</span> <span class="font-medium capitalize">${booking.status}</span></div>
          <div><span class="text-slate-500">Check-in:</span> <span class="font-medium">${new Date(booking.checkInDate).toDateString()}</span></div>
          <div><span class="text-slate-500">Check-out:</span> <span class="font-medium">${new Date(booking.checkOutDate).toDateString()}</span></div>
          <div><span class="text-slate-500">Guests:</span> <span class="font-medium">${booking.guests ?? "-"}</span></div>
        </div>
      </div>
    </div>

    <!-- Line items -->
    <div class="px-8 mt-6">
      <div class="rounded-xl border border-slate-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50 text-left text-sm text-slate-700">
            <tr>
              <th class="px-6 py-3">Description</th>
              <th class="px-6 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr class="border-t border-slate-200">
              <td class="px-6 py-3">Total Paid</td>
              <td class="px-6 py-3 text-right font-medium">${fmtMoney(total, currency)}</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50">
            <tr class="border-t border-slate-200">
              <td class="px-6 py-3 font-semibold">TOTAL</td>
              <td class="px-6 py-3 text-right font-semibold">${fmtMoney(total, currency)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Payment -->
    <div class="px-8 mt-6">
      <div class="rounded-xl border border-slate-200 overflow-hidden">
        <div class="bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700">Payment</div>
        <div class="px-6 py-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span class="text-slate-500">Method:</span> <span class="font-medium">Card (Stripe)</span></div>
          <div><span class="text-slate-500">Status:</span> <span class="font-medium capitalize">${payment.status}</span></div>
          <div><span class="text-slate-500">Stripe Ref:</span> <span class="font-mono">${payment.providerPaymentId}</span></div>
          <div><span class="text-slate-500">Paid At:</span> <span class="font-medium">${booking.paidAt ? new Date(booking.paidAt).toISOString().replace("T"," ").slice(0,19) : "-"}</span></div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-8 py-8">
      <p class="text-center text-sm text-slate-600">Thank you for booking with <span class="font-medium">${BRAND.name}</span>!</p>
    </div>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (err) {
    console.error("invoice html error:", err);
    return res.status(500).send("Failed to render invoice");
  }
});

export default router;
