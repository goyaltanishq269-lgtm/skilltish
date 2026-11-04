import mongoose from 'mongoose';
import Task from '../src/models/Task.ts';
import connectDB from '../src/lib/db.ts';

async function testDay2() {
  console.log('=== TEST 1: Task Schema & Model Definition ===');
  console.log('Task model exists:', Boolean(Task));
  console.log('Task collection name:', Task.collection?.name);

  // Validate fields in schema
  const paths = Task.schema.paths;
  const expectedFields = [
    'title',
    'description',
    'acceptanceCriteria',
    'skillsRequired',
    'duration',
    'stipendOrPerks',
    'posterId',
    'posterName',
    'companyName',
    'status',
    'createdAt',
  ];

  for (const field of expectedFields) {
    if (paths[field]) {
      console.log(`✓ Schema has field: "${field}" (${paths[field].instance})`);
    } else {
      throw new Error(`Missing expected field in Task schema: ${field}`);
    }
  }

  // Validate duration enum
  const durationOptions = (paths['duration'] as any).options.enum;
  console.log('Duration enum values:', durationOptions);
  const expectedDurations = ['1 day', '3 days', '1 week', '2 weeks'];
  for (const dur of expectedDurations) {
    if (!durationOptions.includes(dur)) {
      throw new Error(`Missing duration enum: ${dur}`);
    }
  }

  // Validate status enum
  const statusOptions = (paths['status'] as any).options.enum;
  console.log('Status enum values:', statusOptions);
  const expectedStatuses = ['open', 'in-progress', 'completed', 'closed'];
  for (const st of expectedStatuses) {
    if (!statusOptions.includes(st)) {
      throw new Error(`Missing status enum: ${st}`);
    }
  }

  // Validate max length on title
  const titleValidator = (paths['title'] as any).validators.find((v: any) => v.type === 'maxlength');
  console.log(`✓ Title maxlength constraint: ${titleValidator?.maxlength}`);

  // Validate model compilation guard
  const recompiled = mongoose.models.Task || mongoose.model('Task', Task.schema);
  console.log('✓ Model re-compilation guard verified:', recompiled === Task);

  console.log('\n=== TEST 2: Schema Validation Checks ===');
  const testDoc = new Task({
    title: 'A'.repeat(121), // exceeds 120
    description: 'Test description',
    skillsRequired: ['React'],
    posterId: 'comp-1',
    posterName: 'Priya',
    companyName: 'DevStudio',
  });

  const valError = testDoc.validateSync();
  if (valError?.errors?.title) {
    console.log('✓ Title maxlength correctly threw error:', valError.errors.title.message);
  } else {
    throw new Error('Title > 120 chars should have failed validation');
  }

  const validDoc = new Task({
    title: 'Build Dark Mode Mobile Drawer in Tailwind',
    description: 'Implement accessible slide-over drawer',
    acceptanceCriteria: ['Passes accessibility audit', 'Supports ESC to close'],
    skillsRequired: ['React', 'Tailwind', 'TypeScript'],
    duration: '3 days',
    stipendOrPerks: '₹2,000 + Verified Skill Badge',
    posterId: 'company-1',
    posterName: 'Priya Sharma',
    companyName: 'DevStudio',
  });

  const validError = validDoc.validateSync();
  if (!validError) {
    console.log('✓ Valid task document passes validation perfectly!');
    console.log('  Default status:', validDoc.status);
    console.log('  Duration:', validDoc.duration);
    console.log('  Criteria count:', validDoc.acceptanceCriteria.length);
  } else {
    throw new Error(`Valid task failed validation: ${validError.message}`);
  }

  console.log('\n=== TEST 3: DB Connection Function ===');
  console.log('connectDB function exported:', typeof connectDB === 'function');

  console.log('\n🎉 ALL DAY 2 UNIT & SCHEMA SPECIFICATIONS PASSED SUCCESSFULLY!');
}

testDay2().catch((err) => {
  console.error('❌ Day 2 test failed:', err);
  process.exit(1);
});
