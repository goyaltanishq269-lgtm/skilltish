import { NextResponse } from 'next/server';
import { getUserById, getBadges, getSubmissions } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const badges = await getBadges(params.id);
    const allSubmissions = await getSubmissions({ studentId: params.id });
    const approvedSubmissions = allSubmissions.filter((s) => s.status === 'approved');

    return NextResponse.json({
      user,
      badges,
      completedTasks: approvedSubmissions,
      allSubmissionsCount: allSubmissions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
