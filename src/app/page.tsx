'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  GraduationCap,
  Building,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  GitPullRequest,
  ExternalLink,
  Layers,
  Building2,
  Users,
  Lock,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import PostTaskModal from '@/components/PostTaskModal';
import { playClickSound } from '@/lib/sounds';

export default function LandingPage() {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'company'>('student');
  const [modalMode, setModalMode] = useState<'signin' | 'register'>('signin');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verified') === 'true') {
        setVerificationStatus('success');
      } else if (params.get('error') === 'verification_failed') {
        setVerificationStatus('failed');
      }
    }
  }, []);

  const user = session?.user;
  const isCompany = user?.role === 'company';

  const handleOpenAuth = (role: 'student' | 'company', mode: 'signin' | 'register' = 'register') => {
    playClickSound();
    setSelectedRole(role);
    setModalMode(mode);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBFBF9] text-[#1B241B] overflow-hidden">
      {/* Subtle Engineering Grid Backdrop */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-16 sm:pb-20 border-b border-[#E3E6DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Verification Status Toast */}
          {verificationStatus === 'success' && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0" />
              <span>Email verified successfully. Full access granted to project challenges &amp; credentials.</span>
            </div>
          )}
          {verificationStatus === 'failed' && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Verification token is invalid or expired. Please request a fresh link.</span>
            </div>
          )}

          {/* Linear-Style Pill Badge */}
          <div className="mb-6 inline-flex items-center gap-2 bg-white/90 border border-[#E4E8DE] rounded-full px-3.5 py-1 text-xs text-[#525E50] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#3E5239] animate-pulse" />
            <span className="font-medium text-[#1B241B]">Verified Developer Proof-of-Work</span>
            <span className="text-[#D5DEC9]">•</span>
            <span className="text-[#525E50]">Engineered by Tanishq Goyal</span>
          </div>

          {/* High-Contrast Clean Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1B241B] leading-[1.1] mb-6 max-w-4xl mx-auto">
            Proof Over Paper:{' '}
            <span className="bg-gradient-to-r from-[#3A4D39] via-[#4F6850] to-[#739072] bg-clip-text text-transparent">
              Verifiable Challenges.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#525E50] leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
            Connect ambitious software engineers with real startup backlogs. Audit actual git commits, verify deliverables in our in-app inspector, and issue cryptographically signed credentials.
          </p>

          {/* Dual CTAs with Modern Curvature */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/feed"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] shadow-sm active:scale-[0.98] transition-transform font-medium text-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Challenges</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {isCompany && (
              <button
                onClick={() => {
                  playClickSound();
                  setIsPostModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] font-medium text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#525E50]" />
                <span>Post a Challenge</span>
              </button>
            )}
          </div>

          {/* INTERACTIVE PREVIEW CARD (Stripe/Linear Clean Slate) */}
          <div className="max-w-2xl mx-auto text-left">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-7 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] relative overflow-hidden transition-all hover:border-[#CCD5C3] hover:shadow-[0_4px_20px_rgba(40,50,40,0.08)] hover:-translate-y-0.5 duration-200 ease-out">
              {/* Card Header & Verifiable Hash Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E4E8DE] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] text-[#F4F6F1] flex items-center justify-center font-bold shrink-0 shadow-sm shadow-[#2D3B2D]/20">
                    <Award className="w-5 h-5 text-[#D5DEC9]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1B241B] tracking-tight">
                      Next.js Architecture Specialist
                    </h3>
                    <p className="text-xs text-[#525E50] flex items-center gap-1.5 mt-0.5">
                      <span>Issued by</span>
                      <strong className="text-[#1B241B] font-semibold">DevStudio</strong>
                      <span>•</span>
                      <span>1-Week Challenge</span>
                    </p>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3E5239]" />
                    <span>Cryptographically Verified</span>
                  </span>
                </div>
              </div>

              {/* Deliverable Proof Snippet */}
              <div className="space-y-3 mb-5">
                <div className="p-3.5 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-[#1B241B]">
                    <span className="flex items-center gap-1.5 font-semibold text-[#1B241B]">
                      <GitPullRequest className="w-3.5 h-3.5 text-[#3E5239]" />
                      PR #42: Migrate REST to Next.js 14 App Router
                    </span>
                    <span className="text-[#374B35] font-semibold text-xs">
                      +1,240 / -312
                    </span>
                  </div>
                  <div className="text-[11px] text-[#525E50] font-sans">
                    Edge Runtime • Strict TypeScript Validation • 100% CI Passing
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EEF2EB]/60 border border-[#D5DEC9] text-xs text-[#1B241B] leading-relaxed flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1B241B] block mb-0.5">
                      Verified by Priya Sharma (Lead Architect @ DevStudio):
                    </span>
                    <p className="italic text-[#525E50]">
                      &ldquo;Decoupled architecture and rigorous TypeScript typing. PR merged and verified credential minted.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient & Inspect Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E4E8DE] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2D3B2D] text-[#F4F6F1] font-medium flex items-center justify-center text-xs">
                    A
                  </div>
                  <div className="text-[#525E50]">
                    Recipient:{' '}
                    <span className="text-[#1B241B] font-medium">Alex Chen</span>{' '}
                    <span className="text-[#525E50]">(Apex Tech Institute)</span>
                  </div>
                </div>

                <Link
                  href="/profile/student-1"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#3E5239] hover:text-[#2D3B2D] self-start sm:self-auto"
                >
                  <span>Inspect Student Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC TICKER STRIP */}
      <div className="border-b border-[#E3E6DC] bg-white/70 py-3 text-xs text-[#525E50] font-medium">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Platform Status: Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Active Challenges: <strong className="text-[#1B241B] font-semibold">14</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Verified PRs: <strong className="text-[#1B241B] font-semibold">48</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Credentials Issued: <strong className="text-[#1B241B] font-semibold">32</strong></span>
          </div>
        </div>
      </div>

      {/* 3-COLUMN ENTERPRISE VALUE GRID */}
      <section className="py-20 bg-transparent border-b border-[#E3E6DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#3E5239] uppercase tracking-wider mb-2 block">
              Architectural Rigor
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1B241B] tracking-tight mb-3">
              Built for Engineering Rigor, Not Keyword Guesswork
            </h2>
            <p className="text-xs sm:text-sm text-[#525E50] font-normal">
              Traditional hiring relies on resume buzzwords. SkillTish replaces guesswork with authentic, verifiable company backlog deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Scoped Challenges */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-sm flex flex-col justify-between hover:border-[#CCD5C3] hover:shadow-md transition">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-[#3E5239]" />
                </div>
                <h3 className="text-base font-bold text-[#1B241B] mb-2">
                  Scoped Backlog Tasks
                </h3>
                <p className="text-xs sm:text-sm text-[#525E50] leading-relaxed mb-6 font-normal">
                  1-day to 2-week backlog tickets from vetted startups. Clear acceptance criteria, architecture specs, and measurable deliverables.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E8DE] text-xs font-medium text-[#3E5239] flex items-center gap-1.5">
                <span>Production Backlogs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Founder Code Reviews */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-sm flex flex-col justify-between hover:border-[#CCD5C3] hover:shadow-md transition">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F4F6F1] text-[#3E5239] border border-[#D5DEC9] flex items-center justify-center mb-4">
                  <Code2 className="w-5 h-5 text-[#3E5239]" />
                </div>
                <h3 className="text-base font-bold text-[#1B241B] mb-2">
                  Audited Pull Requests
                </h3>
                <p className="text-xs sm:text-sm text-[#525E50] leading-relaxed mb-6 font-normal">
                  Startup founders and lead architects inspect actual diffs in our in-app inspector, run CI/CD builds, and provide direct feedback.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E8DE] text-xs font-medium text-[#374B35] flex items-center gap-1.5">
                <span>Direct Lead Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Cryptographic Proof */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-sm flex flex-col justify-between hover:border-[#CCD5C3] hover:shadow-md transition">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7] flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-[#414E3F]" />
                </div>
                <h3 className="text-base font-bold text-[#1B241B] mb-2">
                  Signed Credentials
                </h3>
                <p className="text-xs sm:text-sm text-[#525E50] leading-relaxed mb-6 font-normal">
                  Each approved task generates a public, cryptographic audit certificate with SHA-256 fingerprinting for immediate recruiter validation.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E8DE] text-xs font-medium text-[#414E3F] flex items-center gap-1.5">
                <span>Tamper-Proof Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL PERSONA VALUE PROPOSITION */}
      <section className="py-20 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Persona 1: Engineers */}
            <div className="p-8 rounded-2xl border border-[#E4E8DE] bg-[#F8F9F5]/80 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-4">
                  <GraduationCap className="w-3.5 h-3.5 text-[#3E5239]" />
                  <span>For Early-Career Engineers</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1B241B] tracking-tight mb-3">
                  Replace Resume Buzzwords with Verifiable Proof
                </h3>
                <p className="text-xs sm:text-sm text-[#525E50] mb-6 leading-relaxed">
                  Tired of sending 200 resumes into the void? Build real features for startups, get your code merged, and share immutable verification links directly with engineering hiring managers.
                </p>
                <ul className="space-y-2.5 text-xs text-[#525E50] font-medium mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0" />
                    <span>Real Next.js 14, TypeScript, and MongoDB architectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0" />
                    <span>Direct reviews from verified startup founders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0" />
                    <span>Shareable public portfolio with 3D tilt credentials</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenAuth('student', 'register')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] font-medium text-xs sm:text-sm shadow-sm transition cursor-pointer"
              >
                Sign Up as Student Engineer &rarr;
              </button>
            </div>

            {/* Persona 2: Startups */}
            <div className="p-8 rounded-2xl border border-[#E4E8DE] bg-[#F8F9F5]/80 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7] mb-4">
                  <Building className="w-3.5 h-3.5 text-[#414E3F]" />
                  <span>For Startup Founders &amp; Leads</span>
                </div>
                <h3 className="text-2xl font-bold text-[#1B241B] tracking-tight mb-3">
                  Ship Backlogs &amp; Recruit Vetted Builders
                </h3>
                <p className="text-xs sm:text-sm text-[#525E50] mb-6 leading-relaxed">
                  Post modular tickets from your backlog that need engineering firepower. Review pull requests in our in-app code inspector, issue badges, and recruit top performers with zero recruiting fees.
                </p>
                <ul className="space-y-2.5 text-xs text-[#525E50] font-medium mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2D3B2D] shrink-0" />
                    <span>Clear tickets off your engineering backlog</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2D3B2D] shrink-0" />
                    <span>Evaluate developers on real deliverables before making offers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2D3B2D] shrink-0" />
                    <span>Direct developer outreach and collaboration</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenAuth('company', 'register')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2D3B2D] hover:bg-[#1B241B] text-[#F4F6F1] font-medium text-xs sm:text-sm shadow-sm transition cursor-pointer"
              >
                Sign Up as Startup Founder &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        defaultRole={selectedRole}
        initialMode={modalMode}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Post Task Modal */}
      <PostTaskModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
}
