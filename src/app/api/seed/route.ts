import { NextResponse } from 'next/server';
import { ensureSeeded } from '@/lib/store';

export async function POST() {
  try {
    await ensureSeeded();
    return NextResponse.json({ success: true, message: 'Database initialized with demo data' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
