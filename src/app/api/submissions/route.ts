import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubmissions, createSubmission } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const posterId = searchParams.get('posterId') || undefined;
    const studentId = searchParams.get('studentId') || undefined;
    const taskId = searchParams.get('taskId') || undefined;

    const submissions = await getSubmissions({ posterId, studentId, taskId });
    return NextResponse.json(submissions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const studentId = session?.user ? (session.user as any).id : body.studentId;
    if (!studentId) {
      return NextResponse.json({ error: 'Student authentication required' }, { status: 401 });
    }

    if (!body.taskId || !body.proofUrl) {
      return NextResponse.json({ error: 'taskId and proofUrl (GitHub or Figma) are required' }, { status: 400 });
    }

    const url = body.proofUrl.trim().toLowerCase();
    const isGithubOrFigma = url.includes('github.com') || url.includes('figma.com') || url.startsWith('http');
    if (!isGithubOrFigma) {
      return NextResponse.json({ error: 'Please provide a valid GitHub repository or Figma URL' }, { status: 400 });
    }

    const submission = await createSubmission({
      taskId: body.taskId,
      studentId,
      proofUrl: body.proofUrl.trim(),
      notes: body.notes || '',
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
