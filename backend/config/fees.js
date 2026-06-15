// server/config/fees.js
export const FEES = Object.freeze({
  cleaning: 75,
  service: 89,
  taxes: 112,
});

export function computeBreakdown(nightlyPrice, nights) {
  const base = Number(nightlyPrice || 0) * Number(nights || 0);
  const { cleaning, service, taxes } = FEES;
  const total = base + cleaning + service + taxes;
  return {
    nightly: Number(nightlyPrice || 0),
    nights: Number(nights || 0),
    base,
    cleaning,
    service,
    taxes,
    total,
  };
}

