import crypto from 'node:crypto';

/**
 * Simulated card processor. Never stores the full card number.
 *
 * Test cards:
 *   4242 4242 4242 4242  -> approved
 *   4000 0000 0000 0002  -> declined
 *   any other Luhn-valid number -> approved
 */

function luhnValid(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function detectBrand(digits) {
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(011|5)/.test(digits)) return 'Discover';
  return 'Card';
}

export class PaymentError extends Error {
  constructor(message) {
    super(message);
    this.status = 402;
  }
}

export async function chargeCard({ cardNumber, expiry, cvc, nameOnCard }, amount) {
  const digits = String(cardNumber || '').replace(/\D/g, '');
  if (!nameOnCard || !String(nameOnCard).trim()) throw new PaymentError('Name on card is required.');
  if (digits.length < 13 || digits.length > 19 || !luhnValid(digits)) {
    throw new PaymentError('Card number is invalid.');
  }

  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(expiry || '').trim());
  if (!match) throw new PaymentError('Expiry must be in MM/YY format.');
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) throw new PaymentError('Expiry month is invalid.');
  const endOfMonth = new Date(year, month, 1); // first day of the following month
  if (endOfMonth <= new Date()) throw new PaymentError('Card has expired.');

  if (!/^\d{3,4}$/.test(String(cvc || '').trim())) throw new PaymentError('Security code is invalid.');
  if (!Number.isInteger(amount) || amount <= 0) throw new PaymentError('Invalid charge amount.');

  // Simulate network latency to the "processor".
  await new Promise((r) => setTimeout(r, 600));

  if (digits.endsWith('0002')) throw new PaymentError('Your card was declined.');

  return {
    method: 'mock-card',
    brand: detectBrand(digits),
    last4: digits.slice(-4),
    transactionId: 'txn_' + crypto.randomBytes(8).toString('hex'),
    status: 'paid',
  };
}
