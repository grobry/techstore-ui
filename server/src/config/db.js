import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connects to MongoDB. If MONGO_URI is not set, spins up an in-memory
 * MongoDB so the store runs with zero setup (data resets on restart).
 */
export async function connectDB() {
  let uri = process.env.MONGO_URI?.trim();
  let inMemory = false;

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('nocturne');
    inMemory = true;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return { inMemory };
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
