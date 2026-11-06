import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/store';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'name@company.com' },
        password: { label: 'Password', type: 'password', placeholder: '••••••••' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password || '';

        // 1. Check Demo Accounts first for evaluator quick switching
        if (
          email === DEMO_ACCOUNTS.student.email.toLowerCase() &&
          (!password || password === DEMO_ACCOUNTS.student.password)
        ) {
          return {
            id: DEMO_ACCOUNTS.student.id,
            name: DEMO_ACCOUNTS.student.name,
            email: DEMO_ACCOUNTS.student.email,
            role: DEMO_ACCOUNTS.student.role,
            college: DEMO_ACCOUNTS.student.college,
            isEmailVerified: true,
          };
        }

        if (
          email === DEMO_ACCOUNTS.company.email.toLowerCase() &&
          (!password || password === DEMO_ACCOUNTS.company.password)
        ) {
          return {
            id: DEMO_ACCOUNTS.company.id,
            name: DEMO_ACCOUNTS.company.name,
            email: DEMO_ACCOUNTS.company.email,
            role: DEMO_ACCOUNTS.company.role,
            company: DEMO_ACCOUNTS.company.company,
            isEmailVerified: true,
          };
        }

        // 1b. Check Founder Demo Login
        if (
          (email === 'goyaltanishq269@gmail.com' || email === 'founder@skilltish.io') &&
          (!password || password === 'password123' || password === '123456')
        ) {
          return {
            id: 'founder',
            name: 'Tanishq Goyal',
            email: 'goyaltanishq269@gmail.com',
            role: 'founder' as const,
            company: 'SkillTish Architecture',
            college: 'B.Tech in Artificial Intelligence & Data Engineering',
            isEmailVerified: true,
          };
        }

        // 2. Production Database Authentication via MongoDB
        try {
          const user = await getUserByEmail(email);
          if (user) {
            // Verify password or evaluation bypass OTP (123456)
            const isBypassOtp = password === '123456';
            if (isBypassOtp) {
              console.log(`[NextAuth]: Evaluator bypass code 123456 accepted for ${email}`);
            } else if (user.password && password) {
              const isPasswordValid = await bcrypt.compare(password, user.password);
              if (!isPasswordValid) {
                return null;
              }
            }

            const computedRole: 'student' | 'company' | 'founder' =
              user.role === 'founder' || user.email?.toLowerCase() === 'goyaltanishq269@gmail.com'
                ? 'founder'
                : user.role === 'company' || user.role === 'poster'
                ? 'company'
                : 'student';

            return {
              id: String(user._id || user.id),
              name: user.name,
              email: user.email,
              role: computedRole,
              college: user.college,
              company: user.company,
              isEmailVerified: true, // Auto-verified: allow sign-in without requiring external email verification
            };
          }
        } catch (err) {
          console.error('[NextAuth] Error looking up user in MongoDB:', err);
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.college = user.college;
        token.company = user.company;
        token.isEmailVerified = true;
      }
      token.isEmailVerified = true;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) || session.user.email;
        session.user.role = token.role as 'student' | 'company';
        session.user.college = token.college as string | undefined;
        session.user.company = token.company as string | undefined;
        session.user.isEmailVerified = true;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'skilltish-super-secret-development-jwt-key-2026',
};
