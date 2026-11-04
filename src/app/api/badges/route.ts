import { NextResponse } from 'next/server';
import { getBadges } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId') || undefined;

    const badges = await getBadges(studentId);
    return NextResponse.json(badges);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
