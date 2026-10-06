import { Router } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { calculateTotals } from '../utils/pricing.js';
import { chargeCard } from '../utils/mockPayment.js';

const router = Router();

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QTY_PER_ITEM = 10;

function requireFields(obj, fields, label) {
  const missing = fields.filter((f) => !obj || !String(obj[f] ?? '').trim());
  if (missing.length) throw new HttpError(400, `${label}: missing ${missing.join(', ')}.`);
}

// POST /api/orders  -> validate cart against DB, charge mock card, reserve stock, create order
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { items, customer, shipping, payment } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'Your cart is empty.');
    requireFields(customer, ['name', 'email'], 'Contact');
    if (!EMAIL_RX.test(customer.email)) throw new HttpError(400, 'Please enter a valid email address.');
    requireFields(shipping, ['address', 'city', 'postalCode', 'country'], 'Shipping');
    if (!payment) throw new HttpError(400, 'Payment details are required.');

    // Merge duplicate lines (same product + color) and validate quantities.
    const merged = new Map();
    for (const line of items) {
      if (!mongoose.isValidObjectId(line?.productId)) throw new HttpError(400, 'Invalid product in cart.');
      const qty = Number(line.quantity);
      if (!Number.isInteger(qty) || qty < 1) throw new HttpError(400, 'Invalid quantity in cart.');
      const key = `${line.productId}|${line.color || ''}`;
      const prev = merged.get(key);
      merged.set(key, { productId: line.productId, color: line.color || '', quantity: (prev?.quantity || 0) + qty });
    }
    const lines = [...merged.values()];

    // Load authoritative product data — never trust client prices.
    const ids = [...new Set(lines.map((l) => l.productId))];
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const totalQtyByProduct = new Map();
    for (const l of lines) totalQtyByProduct.set(l.productId, (totalQtyByProduct.get(l.productId) || 0) + l.quantity);

    const problems = [];
    for (const [id, qty] of totalQtyByProduct) {
      const p = byId.get(id);
      if (!p) problems.push({ productId: id, message: 'This product is no longer available.' });
      else if (qty > MAX_QTY_PER_ITEM) problems.push({ productId: id, message: `Limit ${MAX_QTY_PER_ITEM} per customer for ${p.name}.` });
      else if (qty > p.stock) problems.push({ productId: id, message: `Only ${p.stock} of ${p.name} left in stock.` });
    }
    if (problems.length) throw new HttpError(409, problems.map((p) => p.message).join(' '), problems);

    const orderItems = lines.map((l) => {
      const p = byId.get(l.productId);
      const color = p.colors?.some((c) => c.name === l.color) ? l.color : p.colors?.[0]?.name || '';
      return { product: p._id, name: p.name, slug: p.slug, shape: p.shape, accent: p.accent, color, price: p.price, quantity: l.quantity };
    });
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totals = calculateTotals(subtotal);

    // Reserve stock atomically per product; roll back on any failure.
    const reserved = [];
    try {
      for (const [id, qty] of totalQtyByProduct) {
        const r = await Product.updateOne({ _id: id, stock: { $gte: qty } }, { $inc: { stock: -qty } });
        if (r.modifiedCount !== 1) throw new HttpError(409, `${byId.get(id).name} just sold out. Please update your cart.`);
        reserved.push([id, qty]);
      }

      const paymentResult = await chargeCard(payment, totals.total);

      const order = await Order.create({
        items: orderItems,
        customer: { name: customer.name, email: customer.email },
        shipping,
        ...totals,
        payment: paymentResult,
      });

      res.status(201).json(order);
    } catch (err) {
      await Promise.all(reserved.map(([id, qty]) => Product.updateOne({ _id: id }, { $inc: { stock: qty } })));
      throw err;
    }
  })
);

// GET /api/orders/:orderNumber?email=  -> order confirmation lookup
router.get(
  '/:orderNumber',
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber.toUpperCase() }).lean();
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!order || order.customer.email !== email) throw new HttpError(404, 'Order not found.');
    res.json(order);
  })
);

export default router;
