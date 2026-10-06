import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB, disconnectDB } from './config/db.js';
import Product from './models/Product.js';
import { seedProducts } from './utils/seedProducts.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { notFound, errorHandler } from './middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5050;
const isProd = process.env.NODE_ENV === 'production';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
if (!isProd) app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', notFound);

// In production, serve the built React app from client/dist.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (isProd && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use(errorHandler);

async function start() {
  const { inMemory } = await connectDB();
  if (inMemory || (await Product.estimatedDocumentCount()) === 0) {
    const n = await seedProducts();
    console.log(`Seeded ${n} products${inMemory ? ' into in-memory MongoDB' : ''}.`);
  }
  const server = app.listen(PORT, () => {
    console.log(`Nocturne API running at http://localhost:${PORT}${inMemory ? ' (in-memory DB — data resets on restart)' : ''}`);
  });
  server.on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nPort ${PORT} is already in use — probably another copy of this server is still running.`);
      console.error('Close it, or set a different PORT in server/.env (and API_PORT for the client).\n');
    } else {
      console.error('Server error:', err);
    }
    await disconnectDB();
    process.exit(1);
  });

  const shutdown = async () => {
    server.close();
    await disconnectDB();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
