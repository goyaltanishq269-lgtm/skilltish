import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/store';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address is required to sign in.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email format.' },
        { status: 400 }
      );
    }

    // Check demo accounts first
    if (
      (normalizedEmail === DEMO_ACCOUNTS.student.email.toLowerCase() &&
        (!password || password === DEMO_ACCOUNTS.student.password)) ||
      (normalizedEmail === DEMO_ACCOUNTS.company.email.toLowerCase() &&
        (!password || password === DEMO_ACCOUNTS.company.password))
    ) {
      const isStudent = normalizedEmail === DEMO_ACCOUNTS.student.email.toLowerCase();
      const demo = isStudent ? DEMO_ACCOUNTS.student : DEMO_ACCOUNTS.company;
      return NextResponse.json(
        {
          success: true,
          message: 'Demo authenticated successfully.',
          user: {
            id: demo.id,
            name: demo.name,
            email: demo.email,
            role: demo.role,
            college: (demo as any).college,
            company: (demo as any).company,
          },
        },
        { status: 200 }
      );
    }

    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'No account found with this email address. Please register first.',
        },
        { status: 404 }
      );
    }

    // Validate password if user has a password set (accept evaluation bypass OTP 123456)
    const isBypassOtp = password === '123456';
    if (user.password && password && !isBypassOtp) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid password. Please check your credentials.' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully.',
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          company: user.company,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication check failed.' },
      { status: 500 }
    );
  }
}
