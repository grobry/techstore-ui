import mongoose from 'mongoose';

export const CATEGORIES = ['Phones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Accessories'];
export const SHAPES = ['phone', 'tablet', 'laptop', 'headphones', 'earbuds', 'watch', 'camera', 'speaker', 'keyboard'];

const specSchema = new mongoose.Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const colorSchema = new mongoose.Schema(
  { name: { type: String, required: true }, hex: { type: String, required: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    // Prices are stored in cents to avoid floating-point rounding errors.
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    colors: { type: [colorSchema], default: [] },
    specs: { type: [specSchema], default: [] },
    // Visuals: optional photo URL; otherwise the client renders vector art.
    image: { type: String, default: '' },
    shape: { type: String, enum: SHAPES, default: 'phone' },
    accent: { type: String, default: '#7c9cff' },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', tagline: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
