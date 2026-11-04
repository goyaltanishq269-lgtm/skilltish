import { NextResponse } from 'next/server';
import { getTaskById, getSubmissions } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await getTaskById(params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const submissions = await getSubmissions({ taskId: params.id });

    return NextResponse.json({
      ...task,
      submissionCount: submissions.length,
      submissions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
