import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import SplashLoader from '@/components/SplashLoader';
import DemoSwitcherDock from '@/components/DemoSwitcherDock';
import Footer from '@/components/Footer';

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
          <Footer />
          <DemoSwitcherDock />
        </Providers>
      </body>
    </html>
  );
}
