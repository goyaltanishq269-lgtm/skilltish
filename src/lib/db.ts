import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
  // eslint-disable-next-line no-var
  var mongooseConnectionCache: MongooseCache | undefined;
}

// Cache Mongoose connection globally (global.mongoose) to reuse pool across Next.js invocations
let cached: MongooseCache = global.mongoose || global.mongooseConnectionCache || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}
if (!global.mongooseConnectionCache) {
  global.mongooseConnectionCache = cached;
}

/**
 * Fast-Fail Connection Pooling Handler.
 * Reuses existing global connection pool.
 * Implements aggressive 2.5s server selection timeout to immediately failover to global.memoryStore.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    const errorMsg = 'MONGODB_URI is undefined. Operating in fast-fail mode with global.memoryStore.';
    console.warn(`[MongoDB Fast-Fail]: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // If already connected and ready, return existing cached connection immediately (< 1ms)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1500, // Instant fast-fail after 1.5s
      connectTimeoutMS: 2000,
      socketTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('[MongoDB]: Connected successfully to MongoDB Atlas cluster.');
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn(
          `[MongoDB Fast-Fail]: MongoDB Atlas did not respond within 1500ms (${err.message}). Triggering global.memoryStore fallback.`
        );
        throw new Error(`MongoDB fast-fail timeout: ${err.message}`);
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectDB;
