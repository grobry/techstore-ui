// `npm run seed` — resets the catalog in the database at MONGO_URI.
// (The in-memory database used when MONGO_URI is empty is seeded automatically on start.)
import 'dotenv/config';
import { connectDB, disconnectDB } from './config/db.js';
import { seedProducts } from './utils/seedProducts.js';

if (!process.env.MONGO_URI?.trim()) {
  console.log('MONGO_URI is not set — the in-memory database is seeded automatically when the server starts.');
  process.exit(0);
}

try {
  await connectDB();
  const n = await seedProducts();
  console.log(`Seeded ${n} products.`);
} catch (err) {
  console.error('Seeding failed:', err);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
