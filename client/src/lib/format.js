const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdWhole = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** Format an amount in cents. Whole-dollar amounts drop the ".00". */
export function formatPrice(cents) {
  const dollars = (cents || 0) / 100;
  return Number.isInteger(dollars) ? usdWhole.format(dollars) : usd.format(dollars);
}

// Mirror of server/src/utils/pricing.js — the server recalculates authoritatively.
export const FREE_SHIPPING_THRESHOLD = 50000;
export const FLAT_SHIPPING = 1500;
export const TAX_RATE = 0.0825;

export function estimateTotals(subtotal) {
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, shippingCost, tax, total: subtotal + shippingCost + tax };
}
