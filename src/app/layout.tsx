import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import SplashLoader from '@/components/SplashLoader';
import DemoSwitcherDock from '@/components/DemoSwitcherDock';
import Footer from '@/components/Footer';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

export const metadata: Metadata = {
  title: 'SkillTish | Proof-of-Work Platform for Engineers',
  description:
    'Bridging elite software engineers with startup backlogs through verifiable project challenges and authenticated credentials.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#FBFBF9] text-[#1B241B] flex flex-col min-h-screen selection:bg-[#D5DEC9] selection:text-[#1B241B] relative">
        {/* Organic Nature Radial Ambient Canvas Gradient */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#EDEFE6] via-[#FBFBF9] to-[#F5F6F0] opacity-80" />

        <Providers>
          <div className="relative z-10 flex flex-col min-h-screen">
            <SplashLoader />
            <Navbar />
            <EmailVerificationBanner />
            <main className="flex-1">{children}</main>
            <Footer />
            <DemoSwitcherDock />
          </div>
        </Providers>
      </body>
    </html>
  );
}
