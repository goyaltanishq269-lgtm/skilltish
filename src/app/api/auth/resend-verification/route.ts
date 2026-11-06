import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserByEmail, setVerificationToken } from '@/lib/store';
import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let targetEmail: string | undefined;

    // Check body first
    try {
      const body = await req.json();
      if (body?.email && typeof body.email === 'string') {
        targetEmail = body.email.trim().toLowerCase();
      }
    } catch {
      // Body may be empty if called from session context
    }

    // If not in body, check authenticated session
    if (!targetEmail) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        targetEmail = session.user.email.trim().toLowerCase();
      }
    }

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: 'Email address is required to resend verification link.' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(targetEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        {
          success: true,
          alreadyVerified: true,
          message: 'Your email address is already verified.',
        },
        { status: 200 }
      );
    }

    // Generate fresh 32-byte hex token valid for 15 minutes
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await setVerificationToken(targetEmail, token, expires);

    // Send email via Resend
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
    await sendVerificationEmail(targetEmail, verificationUrl);

    return NextResponse.json(
      {
        success: true,
        message: 'A new verification link has been sent to your email address.',
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('[API /api/auth/resend-verification] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to resend verification email.' },
      { status: 500 }
    );
  }
}
