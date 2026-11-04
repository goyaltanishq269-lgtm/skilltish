import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnectionCache: MongooseCache | undefined;
}

// Cache mongoose.connection on global to prevent connection leaks during Next.js hot-reloading
let cached: MongooseCache = global.mongooseConnectionCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseConnectionCache) {
  global.mongooseConnectionCache = cached;
}

/**
 * Reusable, cached Mongoose connection handler.
 * Prevents multiple connections during Next.js fast-refresh in development.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    const errorMsg =
      'process.env.MONGODB_URI is missing or undefined. Please configure MONGODB_URI in .env.local';
    console.warn(`[MongoDB Warning]: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // If already connected and ready, return existing cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('[MongoDB]: Connected successfully to database.');
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn(
          `[MongoDB Warning]: Failed to connect to MongoDB at "${MONGODB_URI}": ${err.message}`
        );
        throw new Error(`Failed to connect to MongoDB: ${err.message}`);
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
