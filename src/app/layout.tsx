import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import SplashLoader from '@/components/SplashLoader';

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
          <SplashLoader />
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/[0.08] bg-zinc-950/80 backdrop-blur-md py-8 text-center text-xs text-zinc-500">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-200">SkillTish</span>
                <span>© 2026</span>
                <span>•</span>
                <span>Built with Next.js 14, TypeScript, Tailwind CSS &amp; MongoDB by <strong className="text-zinc-200 font-semibold">Tanishq Goyal</strong>.</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px]">
                <span className="text-emerald-400 font-medium">Production Ready</span>
                <span>•</span>
                <span>Cryptographically Verifiable</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
