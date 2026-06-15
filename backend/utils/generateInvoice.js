// backend/utils/generateInvoice.js
import fs from "fs";
import path from "path";
import os from "os";
import PDFDocument from "pdfkit";

/**
 * Generates a simple invoice PDF in the OS temp folder and returns:
 *   { filepath, filename }
 * You will serve this later via an Express static route at /invoices.
 */
export async function generateInvoice({ booking, payment, home }) {
  const currency = (payment?.currency || booking?.currency || "usd").toUpperCase();
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(n || 0));

  const invoiceNo = `INV-${new Date().getFullYear()}-${String(payment?._id).slice(-6).toUpperCase()}`;
  const nights = Math.max(
    0,
    Math.round((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / 86400000)
  );

  const total = Number(booking?.totalPrice ?? payment?.amount ?? 0);

  const filename = `${invoiceNo}.pdf`;
  const filepath = path.join(os.tmpdir(), filename);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

        // Header branding
    doc.fontSize(20).text("RentHub", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#666")
    .text("renthub@gmail.com")
    .text("Test invoice (not a tax document).");

    // Guest name logic (replaces the hard-coded "Guest")
    const guestName =
    booking?.guestName ||
    booking?.guest?.name ||
    booking?.name ||
    booking?.customerName ||
    "Guest";
    const guestEmail =
    booking?.guestEmail || booking?.guest?.email || booking?.email || "";

    doc.fontSize(12).text("Bill To", { underline: true });
    doc.fontSize(10).text(guestName);
    if (guestEmail) doc.text(guestEmail);


    doc.fontSize(12).text("Booking Details", { underline: true });
    doc.fontSize(10)
      .text(`Booking ID: ${String(booking._id)}`)
      .text(`Property: ${home?.title || "Property"}`)
      .text(`Check-in: ${new Date(booking.checkInDate).toDateString()}`)
      .text(`Check-out: ${new Date(booking.checkOutDate).toDateString()}`)
      .text(`Nights: ${nights}`)
      .moveDown(0.5);

    // Amounts
    doc.fontSize(12).text("Amount", { underline: true });
    doc.fontSize(10).text(`Total Paid: ${fmt(total)}`);
    doc.text(`Currency: ${currency}`);
    doc.text(`Payment Status: ${payment?.status || "succeeded"}`);
    doc.text(`Stripe Ref: ${payment?.providerPaymentId || "-"}`);

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor("#666")
      .text("Thank you for your booking!", { align: "center" });

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { filepath, filename };
}
