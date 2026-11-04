import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skilltish';

async function seed() {
  console.log('Connecting to:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Seeding initial collections...');
    
    const db = mongoose.connection.db;
    
    await db.collection('users').deleteMany({});
    await db.collection('tasks').deleteMany({});
    await db.collection('submissions').deleteMany({});
    await db.collection('badges').deleteMany({});

    console.log('Database cleared and ready.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
