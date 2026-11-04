import {
  getUserById,
  getBadges,
  getSubmissions,
  createSubmission,
  updateSubmissionStatus,
  getTaskById,
} from '../src/lib/store';

async function runTest() {
  console.log('--- Testing Profile & Badge Pipeline ---');

  // 1. Audit Profile Data Resolution for student-1
  const student = await getUserById('student-1');
  console.log('1. User details for student-1:');
  console.log(`   Found: ${student?.name} (${student?.email}) - ${student?.college}`);
  if (!student || student.name !== 'Alex Chen') {
    throw new Error('FAILED: student-1 user resolution failed');
  }

  // 2. Query Badges for student-1
  const badgesBefore = await getBadges('student-1');
  console.log(`2. Badges for student-1: ${badgesBefore.length} badges found`);
  badgesBefore.forEach((b: any, idx: number) => {
    console.log(`   Badge ${idx + 1}: ${b.title} [${b.skill}] - Task: ${b.task?.title || 'N/A'}`);
  });
  if (badgesBefore.length === 0) {
    throw new Error('FAILED: expected initial badges for student-1');
  }

  // 3. Query Submissions for student-1
  const allSubsBefore = await getSubmissions({ studentId: 'student-1' });
  const approvedBefore = allSubsBefore.filter((s) => s.status === 'approved');
  console.log(`3. Submissions for student-1: ${allSubsBefore.length} total, ${approvedBefore.length} approved`);
  approvedBefore.forEach((s: any, idx: number) => {
    console.log(`   Approved ${idx + 1}: Task="${s.task?.title}", Proof="${s.proofUrl}", Company="${s.task?.companyName}"`);
  });
  if (approvedBefore.length === 0) {
    throw new Error('FAILED: expected approved submissions for student-1');
  }

  // 4. Test Approval Pipeline
  console.log('4. Testing submission approval pipeline:');
  const taskToSubmit = '660000000000000000000011';
  const newSub = await createSubmission({
    taskId: taskToSubmit,
    studentId: 'student-1',
    studentName: 'Alex Chen',
    proofUrl: 'https://github.com/alexchen/pricing-calculator-v2',
    notes: 'Built interactive pricing calculator with responsive Tailwind drawer',
  });
  console.log(`   Created new submission: ${newSub._id} with status "${newSub.status}"`);

  // Approve the submission
  const approvedSub = await updateSubmissionStatus(
    newSub._id,
    'approved',
    'Outstanding component design and responsive layout!',
    {
      issuerId: 'company-1',
      issuerName: 'Priya Sharma',
      companyName: 'DevStudio',
    }
  );
  console.log(`   Approved submission: ${approvedSub._id} status is now "${approvedSub.status}"`);
  if (approvedSub.status !== 'approved') {
    throw new Error('FAILED: submission status did not update to approved');
  }

  // Check Task status updated to completed
  const updatedTask = await getTaskById(taskToSubmit);
  console.log(`   Task ${taskToSubmit} status updated to: "${updatedTask?.status}"`);
  if (updatedTask?.status !== 'completed') {
    throw new Error(`FAILED: task status expected to be "completed", got "${updatedTask?.status}"`);
  }

  // Check Badges updated
  const badgesAfter = await getBadges('student-1');
  console.log(`   Badges after approval: ${badgesAfter.length} (was ${badgesBefore.length})`);
  const newlyIssuedBadge = badgesAfter[0];
  console.log(`   Latest Badge: "${newlyIssuedBadge.title}" issued by ${newlyIssuedBadge.companyName || newlyIssuedBadge.issuerName}`);
  if (badgesAfter.length <= badgesBefore.length) {
    throw new Error('FAILED: new badge was not added');
  }

  // Check Submissions updated
  const allSubsAfter = await getSubmissions({ studentId: 'student-1' });
  const approvedAfter = allSubsAfter.filter((s) => s.status === 'approved');
  console.log(`   Approved submissions after approval: ${approvedAfter.length} (was ${approvedBefore.length})`);
  if (approvedAfter.length <= approvedBefore.length) {
    throw new Error('FAILED: approved submissions count did not increase');
  }

  console.log('\n--- ALL PROFILE & BADGE PIPELINE TESTS PASSED CLEANLY! ---');
}

runTest().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
