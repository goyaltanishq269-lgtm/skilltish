import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SkillTish | Proof Over Paper — Verifiable Micro-Tasks & Badges',
  description:
    'Bridging student talent and ambitious startups through verifiable micro-tasks and authenticated skill badges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-[#09090b] text-zinc-100 flex flex-col min-h-screen selection:bg-indigo-500/30 selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/[0.08] bg-zinc-950/80 backdrop-blur-md py-8 text-center text-xs text-zinc-500">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-200">SkillTish</span>
                <span>— Verifiable Micro-Task Credentials for Students & Companies</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-500">
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
