import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'student' | 'company' | 'founder';
      college?: string;
      company?: string;
      isEmailVerified?: boolean;
      emailVerified?: Date | string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: 'student' | 'company' | 'founder';
    college?: string;
    company?: string;
    isEmailVerified?: boolean;
    emailVerified?: Date | string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'student' | 'company' | 'founder';
    college?: string;
    company?: string;
    isEmailVerified?: boolean;
    emailVerified?: Date | string | null;
  }
}
