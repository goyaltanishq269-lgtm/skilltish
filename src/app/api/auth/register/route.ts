import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '@/lib/store';
import { sendVerificationEmail } from '@/lib/email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, college, company, bio, skills } = body;

    // 1. Validate name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    // 2. Validate email presence and syntax
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 3. Validate password (minimum 6 characters)
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 4. Validate role
    const validRole = role === 'company' ? 'company' : 'student';

    // 5. Check for duplicate user
    const existing = await getUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists. Please sign in instead.',
        },
        { status: 409 }
      );
    }

    // 6. 12-round bcrypt password hash
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Generate cryptographically secure verification token (valid for 15 minutes)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // 8. Persist to MongoDB Atlas via User model / store with unverified status
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: validRole,
      college: college?.trim() || (validRole === 'student' ? 'Apex Tech Institute' : ''),
      company: company?.trim() || (validRole === 'company' ? 'TechCorp Ventures' : ''),
      bio: bio?.trim() || '',
      skills: Array.isArray(skills) ? skills : ['TypeScript', 'Next.js', 'React'],
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // 9. Dispatch verification email via Resend
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(normalizedEmail, verificationUrl);

    // 10. Return safe payload (strictly omitting password hash)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created! Please check your email inbox to verify your account.',
        isEmailVerified: false,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          company: user.company,
          isEmailVerified: false,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration route error:', error);
    if (error.message?.includes('already exists')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
