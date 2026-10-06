import { Router } from 'express';
import Product, { CATEGORIES } from '../models/Product.js';
import { asyncHandler, HttpError } from '../middleware/error.js';

const router = Router();

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  featured: { featured: -1, rating: -1, name: 1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
  newest: { createdAt: -1 },
};

// GET /api/products?category=&q=&sort=&minPrice=&maxPrice=&featured=&limit=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category, q, sort = 'featured', minPrice, maxPrice, featured, limit } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      if (!CATEGORIES.includes(category)) throw new HttpError(400, 'Unknown category.');
      filter.category = category;
    }
    if (q && String(q).trim()) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      filter.$or = [{ name: rx }, { brand: rx }, { tagline: rx }, { category: rx }];
    }
    // Price filters arrive in dollars; DB stores cents.
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (minPrice !== undefined && minPrice !== '' && Number.isFinite(min)) filter.price = { ...filter.price, $gte: Math.round(min * 100) };
    if (maxPrice !== undefined && maxPrice !== '' && Number.isFinite(max)) filter.price = { ...filter.price, $lte: Math.round(max * 100) };
    if (featured === 'true') filter.featured = true;

    const lim = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 100);
    const products = await Product.find(filter).sort(SORTS[sort] || SORTS.featured).limit(lim).lean();
    res.json(products);
  })
);

// GET /api/products/categories -> [{ name, count }]
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    res.json(CATEGORIES.map((name) => ({ name, count: map[name] || 0 })));
  })
);

// GET /api/products/:slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() }).lean();
    if (!product) throw new HttpError(404, 'Product not found.');

    const related = await Product.find({ category: product.category, _id: { $ne: product._id } })
      .sort({ rating: -1 })
      .limit(4)
      .lean();
    res.json({ product, related });
  })
);

export default router;
