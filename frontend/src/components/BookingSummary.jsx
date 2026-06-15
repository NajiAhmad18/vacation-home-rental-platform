import React from "react";

const FEES = {
  cleaning: 75,
  service: 89,
  taxes: 112,
};

const formatMoney = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    Number(n || 0)
  );

const formatDate = (d) =>
  d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Invalid date";

export default function BookingSummary({ booking }) {
  if (!booking) return <p className="text-slate-600">Booking not found</p>;

  const home = booking.homeId || {};

  // Dates & nights (exclusive check-out)
  const checkIn = booking.checkInDate ? new Date(booking.checkInDate) : null;
  const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate) : null;
  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((checkOut - checkIn) / 86400000))
      : 0;

  // Nightly & computed totals (fallback when server total isn't present)
  const nightly = Number(home?.price || 0);
  const basePrice = nightly * nights;
  const computedTotal =
    basePrice + FEES.cleaning + FEES.service + FEES.taxes;

  // Prefer server total if it exists, otherwise use computed
  const serverTotal = Number(booking.totalPrice);
  const total = Number.isFinite(serverTotal) ? serverTotal : computedTotal;

  const canShowBreakdown = nightly > 0 && nights > 0;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-6">
        Booking Summary
      </h2>

      {/* Listing header */}
      <div className="flex gap-5 mb-6">
        <img
          src={home.images?.[0] || "/default-home.jpg"}
          alt={home?.title || "Listing"}
          className="w-28 h-24 md:w-32 md:h-28 rounded-xl object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 truncate">
            {home?.title || "—"}
          </h3>
          <p className="text-slate-500 mt-1">
            {home?.location?.city || "—"}
            {home?.location?.city && home?.location?.district ? ", " : ""}
            {home?.location?.district || ""}
          </p>
          {(home?.averageRating || home?.reviewsCount) && (
            <p className="text-amber-500 text-sm mt-1">
              ⭐ {home?.averageRating ?? "-"} ({home?.reviewsCount ?? 0} reviews)
            </p>
          )}
        </div>
      </div>

      {/* Dates row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Check-in
          </p>
          <p className="text-slate-900 font-medium">{formatDate(checkIn)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Check-out
          </p>
          <p className="text-slate-900 font-medium">{formatDate(checkOut)}</p>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="pt-2">
        <h4 className="sr-only">Price Breakdown</h4>

        {canShowBreakdown ? (
          <div className="divide-y divide-slate-200">
            <div className="flex items-center justify-between py-3">
              <p className="text-slate-600">
                {formatMoney(nightly)} × {nights} night
                {nights === 1 ? "" : "s"}
              </p>
              <p className="text-slate-900 font-medium">
                {formatMoney(basePrice)}
              </p>
            </div>

            <div className="flex items-center justify-between py-3">
              <p className="text-slate-600">Cleaning fee</p>
              <p className="text-slate-900 font-medium">
                {formatMoney(FEES.cleaning)}
              </p>
            </div>

            <div className="flex items-center justify-between py-3">
              <p className="text-slate-600">Service fee</p>
              <p className="text-slate-900 font-medium">
                {formatMoney(FEES.service)}
              </p>
            </div>

            <div className="flex items-center justify-between py-3">
              <p className="text-slate-600">Taxes</p>
              <p className="text-slate-900 font-medium">
                {formatMoney(FEES.taxes)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 mb-2">
            Price breakdown unavailable (missing listing price). The total below
            uses the server amount when available.
          </p>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <p className="text-base md:text-lg font-semibold text-slate-900">
            Total
          </p>
          <p className="text-base md:text-lg font-bold text-slate-900">
            {formatMoney(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
