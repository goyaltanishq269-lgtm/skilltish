export interface MockUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'poster';
  college: string;
  company?: string;
  bio: string;
  skills: string[];
  avatar: string;
  createdAt: string;
}

export interface MockTask {
  _id: string;
  title: string;
  description: string;
  acceptanceCriteria?: string[];
  skillsRequired: string[];
  duration: '1 day' | '3 days' | '1 week' | '2 weeks';
  stipendOrPerks?: string;
  posterId: string;
  posterName?: string;
  companyName?: string;
  poster?: {
    _id: string;
    name: string;
    email: string;
    company?: string;
  };
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  reward: string;
  createdAt: string;
}

export interface MockSubmission {
  _id: string;
  taskId: string;
  task?: MockTask;
  studentId: string;
  student?: MockUser;
  proofUrl: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface MockBadge {
  _id: string;
  title: string;
  skill: string;
  taskId: string;
  studentId: string;
  issuerId?: string;
  issuedAt: string;
}

export const INITIAL_USERS: MockUser[] = [
  {
    _id: '660000000000000000000001',
    name: 'Alex Chen',
    email: 'student@college.edu',
    role: 'student',
    college: 'Apex Tech Institute',
    company: '',
    bio: 'CS junior focused on front-end engineering, React, TypeScript, and modern design systems. Building production-ready micro-projects to prove verifiable skills.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Figma', 'Node.js'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    _id: '660000000000000000000002',
    name: 'Priya Sharma',
    email: 'founder@startup.com',
    role: 'poster',
    college: '',
    company: 'DevStudio',
    bio: 'Founder & Head of Engineering at DevStudio. We create developer productivity tools and love discovering ambitious students via verifiable proof-of-work.',
    skills: ['Next.js', 'System Architecture', 'Product Management', 'MongoDB'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    createdAt: '2026-01-05T09:00:00.000Z',
  },
];

export const INITIAL_TASKS: MockTask[] = [
  {
    _id: '660000000000000000000011',
    title: 'Build an Interactive Pricing Calculator',
    description: 'Design and develop a modern, mobile-responsive pricing calculator with tiered monthly/annual discount toggles, animated slider, and interactive ROI metrics. Use Tailwind CSS and TypeScript.',
    skillsRequired: ['React', 'Tailwind CSS', 'TypeScript'],
    duration: '1 day',
    posterId: '660000000000000000000002',
    status: 'open',
    reward: 'Frontend UI Champion Badge',
    createdAt: '2026-10-18T08:30:00.000Z',
  },
  {
    _id: '660000000000000000000012',
    title: 'Design Mobile Onboarding Flow in Figma',
    description: 'Craft a high-fidelity 4-step student onboarding workflow with interactive component states, dark mode variants, and frictionless navigation. Submit a Figma link with edit/view permissions.',
    skillsRequired: ['Figma', 'UI/UX', 'Mobile Design'],
    duration: '3 days',
    posterId: '660000000000000000000002',
    status: 'open',
    reward: 'Product Design Verified Badge',
    createdAt: '2026-10-17T11:00:00.000Z',
  },
  {
    _id: '660000000000000000000013',
    title: 'Migrate REST Endpoint to Next.js 14 App Router',
    description: 'Refactor our legacy Express REST endpoint into Next.js 14 App Router route handlers with edge compatibility, strict Zod payload validation, and clean error responses.',
    skillsRequired: ['Next.js', 'TypeScript', 'Node.js'],
    duration: '1 week',
    posterId: '660000000000000000000002',
    status: 'open',
    reward: 'API Architecture Badge',
    createdAt: '2026-10-15T14:15:00.000Z',
  },
  {
    _id: '660000000000000000000014',
    title: 'Implement OAuth 2.0 Credentials & JWT Session Handling',
    description: 'Integrate NextAuth v4 credentials workflow with custom session callbacks, role-based protection, and token expiration handling.',
    skillsRequired: ['Next.js', 'TypeScript', 'NextAuth'],
    duration: '3 days',
    posterId: '660000000000000000000002',
    status: 'closed',
    reward: 'Auth Security Badge',
    createdAt: '2026-10-10T10:00:00.000Z',
  },
];

export const INITIAL_SUBMISSIONS: MockSubmission[] = [
  {
    _id: '660000000000000000000021',
    taskId: '660000000000000000000013',
    studentId: '660000000000000000000001',
    proofUrl: 'https://github.com/alexchen/nextjs-app-router-migration',
    notes: 'Implemented the new App Router route handler with streaming JSON support, Zod runtime validation, and 100% unit test coverage. Tested against edge latency benchmarks.',
    status: 'pending',
    createdAt: '2026-10-18T16:20:00.000Z',
  },
  {
    _id: '660000000000000000000022',
    taskId: '660000000000000000000014',
    studentId: '660000000000000000000001',
    proofUrl: 'https://github.com/alexchen/nextauth-credentials-demo',
    notes: 'Configured credentials provider with NextAuth JWT strategy, role claims in session callbacks, and middleware route guards.',
    status: 'approved',
    feedback: 'Phenomenal attention to security details and TypeScript typing. Verified and issued skill badge!',
    createdAt: '2026-10-12T12:00:00.000Z',
    reviewedAt: '2026-10-13T09:30:00.000Z',
  },
];

export const INITIAL_BADGES: MockBadge[] = [
  {
    _id: '660000000000000000000031',
    title: 'Auth Security Badge',
    skill: 'NextAuth',
    taskId: '660000000000000000000014',
    studentId: '660000000000000000000001',
    issuerId: '660000000000000000000002',
    issuedAt: '2026-10-13T09:30:00.000Z',
  },
  {
    _id: '660000000000000000000032',
    title: 'Frontend UI Champion Badge',
    skill: 'React',
    taskId: '660000000000000000000011',
    studentId: '660000000000000000000001',
    issuerId: '660000000000000000000002',
    issuedAt: '2026-10-05T14:00:00.000Z',
  },
];
