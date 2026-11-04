import connectDB from './db';

export { connectDB };

/**
 * Backwards-compatible connection helper that wraps connectDB().
 * Prevents duplicate global connection caches while preserving the
 * { isConnected: boolean, error?: string } shape expected by store.ts.
 */
export async function connectToDatabase(): Promise<{ isConnected: boolean; error?: string }> {
  try {
    await connectDB();
    return { isConnected: true };
  } catch (error: any) {
    return { isConnected: false, error: error?.message || 'Database connection error' };
  }
}

export default connectToDatabase;
