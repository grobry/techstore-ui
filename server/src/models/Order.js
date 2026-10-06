import mongoose from 'mongoose';
import crypto from 'node:crypto';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    shape: String,
    accent: String,
    color: { type: String, default: '' },
    price: { type: Number, required: true }, // cents, captured at purchase time
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

function generateOrderNumber() {
  return 'NC-' + crypto.randomBytes(5).toString('hex').toUpperCase();
}

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, default: generateOrderNumber },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
    },
    shipping: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    payment: {
      method: { type: String, default: 'mock-card' },
      brand: String,
      last4: String,
      transactionId: String,
      status: { type: String, enum: ['paid', 'failed'], default: 'paid' },
    },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
