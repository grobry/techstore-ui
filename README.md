# Nocturne — MERN Tech Storefront

A sleek, dark-minimal storefront for high-end tech, built with **MongoDB, Express, React (Vite) and Node**.

- Catalog with category chips, search, price ranges and sorting (all synced to the URL)
- Product pages with color swatches, quantity, stock status, specs and related products
- Slide-out bag + full cart page (persisted in `localStorage`)
- Checkout with a **mock payment processor** — no real charges, no card numbers stored
- Server-side price/stock validation and atomic stock reservation with rollback
- Zero-setup database: if `MONGO_URI` is empty, an in-memory MongoDB starts and is auto-seeded

## Quick start

Requires Node.js 18+.

```bash
npm run install:all     # installs root, server and client dependencies
npm run dev             # API on :5050, storefront on http://localhost:5173
```

The first run downloads a MongoDB binary for the in-memory database (~100 MB, one time).
In-memory data resets every time the server restarts.

### Using a real MongoDB

```bash
cp server/.env.example server/.env
# set MONGO_URI=mongodb://127.0.0.1:27017/nocturne  (or a MongoDB Atlas URI)
npm run seed            # loads the 16-product catalog
npm run dev
```

If the database is empty on start, the server seeds it automatically.

## Test cards (mock payments)

| Card number           | Result   |
| --------------------- | -------- |
| `4242 4242 4242 4242` | Approved |
| `4000 0000 0000 0002` | Declined |

Use any future expiry (e.g. `12/30`) and any 3-digit CVC. The checkout page has one-click buttons that fill these in.

## Production build

```bash
npm run build                          # builds client/dist
NODE_ENV=production npm start          # Express serves the API and the built app on :5050
```

On Windows PowerShell: `$env:NODE_ENV="production"; npm start`

## Project structure

```
server/
  src/
    index.js              Express app, startup, auto-seed
    config/db.js          Mongo connection (falls back to in-memory)
    models/               Product, Order (prices stored in cents)
    routes/products.js    GET /api/products, /categories, /:slug
    routes/orders.js      POST /api/orders, GET /api/orders/:orderNumber?email=
    utils/mockPayment.js  Simulated card processor (Luhn, expiry, CVC, test declines)
    utils/pricing.js      Shipping ($15, free over $500) and tax (8.25%)
    data/products.js      Seed catalog (fictional brands)
client/
  src/
    pages/                Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation
    components/           Navbar, CartDrawer, ProductCard, ProductArt (vector product art), …
    context/CartContext.jsx
    index.css             Design tokens + all styles
```

## API

| Method | Path                                  | Notes                                                        |
| ------ | ------------------------------------- | ------------------------------------------------------------ |
| GET    | `/api/products`                       | `category`, `q`, `sort` (`featured`, `price-asc`, `price-desc`, `rating`, `newest`), `minPrice`, `maxPrice` (dollars), `featured=true` |
| GET    | `/api/products/categories`            | `[{ name, count }]`                                          |
| GET    | `/api/products/:slug`                 | `{ product, related }`                                       |
| POST   | `/api/orders`                         | `{ items:[{productId, quantity, color}], customer, shipping, payment }` |
| GET    | `/api/orders/:orderNumber?email=`     | Order lookup (email must match)                              |

## Product images

Products render stylized vector art from their `shape` and `accent` fields. To use photos instead,
set a product's `image` field to a URL — the card and product page will show it automatically.

## Ideas for next steps

- User accounts (JWT) and order history
- Admin dashboard for products, stock and orders
- Swap the mock processor for Stripe Checkout (`server/src/utils/mockPayment.js` is the only file to replace)
