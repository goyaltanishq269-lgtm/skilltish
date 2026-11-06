export const DEMO_ACCOUNTS = {
  student: {
    id: 'student-1',
    email: 'student@college.edu',
    password: 'password123',
    name: 'Alex Chen',
    role: 'student' as const,
    college: 'Apex Tech Institute',
    isEmailVerified: true,
  },
  company: {
    id: 'company-1',
    email: 'priya@devstudio.io',
    password: 'password123',
    name: 'Priya Sharma',
    role: 'company' as const,
    company: 'DevStudio',
    isEmailVerified: true,
  },
};
