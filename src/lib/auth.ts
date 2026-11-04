import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const DEMO_ACCOUNTS = {
  student: {
    id: 'student-1',
    email: 'student@college.edu',
    password: 'password123',
    name: 'Alex Chen',
    role: 'student' as const,
    college: 'Apex Tech Institute',
  },
  company: {
    id: 'company-1',
    email: 'priya@devstudio.io',
    password: 'password123',
    name: 'Priya Sharma',
    role: 'company' as const,
    company: 'DevStudio',
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'student@college.edu' },
        password: { label: 'Password', type: 'password', placeholder: 'password123' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        if (
          email === DEMO_ACCOUNTS.student.email.toLowerCase() &&
          password === DEMO_ACCOUNTS.student.password
        ) {
          return {
            id: DEMO_ACCOUNTS.student.id,
            name: DEMO_ACCOUNTS.student.name,
            email: DEMO_ACCOUNTS.student.email,
            role: DEMO_ACCOUNTS.student.role,
            college: DEMO_ACCOUNTS.student.college,
          };
        }

        if (
          email === DEMO_ACCOUNTS.company.email.toLowerCase() &&
          password === DEMO_ACCOUNTS.company.password
        ) {
          return {
            id: DEMO_ACCOUNTS.company.id,
            name: DEMO_ACCOUNTS.company.name,
            email: DEMO_ACCOUNTS.company.email,
            role: DEMO_ACCOUNTS.company.role,
            company: DEMO_ACCOUNTS.company.company,
          };
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
        token.role = user.role;
        token.college = user.college;
        token.company = user.company;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'student' | 'company';
        session.user.college = token.college as string | undefined;
        session.user.company = token.company as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'skilltish-super-secret-development-jwt-key-2026',
};
