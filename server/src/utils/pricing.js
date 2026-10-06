// All amounts in cents.
export const FREE_SHIPPING_THRESHOLD = 50000; // $500
export const FLAT_SHIPPING = 1500; // $15
export const TAX_RATE = 0.0825;

export function calculateTotals(subtotal) {
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING;
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, shippingCost, tax, total: subtotal + shippingCost + tax };
}
