import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SkillTish | Proof-of-Work Micro-Tasks & Verified Badges',
  description:
    'Bridging student talent and ambitious startups through verifiable micro-tasks and authenticated skill badges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-850 border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">SkillTish</span>
                <span>— Verifiable Micro-Task Credentials for Students & Companies</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>Next.js 14 App Router</span>
                <span>•</span>
                <span>NextAuth.js</span>
                <span>•</span>
                <span>TypeScript</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
