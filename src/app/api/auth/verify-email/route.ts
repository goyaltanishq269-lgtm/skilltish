import { NextRequest, NextResponse } from 'next/server';
import { verifyUserByToken } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token || typeof token !== 'string') {
      return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
    }

    const verifiedUser = await verifyUserByToken(token);

    if (!verifiedUser) {
      return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
    }

    // Successfully verified! Redirect to opportunity feed with verified banner flag
    const targetUrl = new URL('/feed?verified=true', req.url);
    return NextResponse.redirect(targetUrl);
  } catch (err) {
    console.error('[API /api/auth/verify-email] Error verifying token:', err);
    return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
  }
}
