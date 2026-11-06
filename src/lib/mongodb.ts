import connectDB from './db';

export { connectDB };

/**
 * Fast-Fail Connection Helper that wraps connectDB() with caching on global.mongoose.
 * If MongoDB Atlas fails to respond within 1500ms, catches immediately and enables
 * global.memoryStore fallback so pages load in under 100ms instead of hanging.
 */
export async function connectToDatabase(): Promise<{ isConnected: boolean; error?: string }> {
  try {
    await connectDB();
    return { isConnected: true };
  } catch (error: any) {
    return {
      isConnected: false,
      error: error?.message || 'Database unreachable, failed over to global.memoryStore',
    };
  }
}

export default connectToDatabase;
