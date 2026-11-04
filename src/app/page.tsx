'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  GraduationCap,
  Building,
  Award,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Code2,
  CheckCircle2,
  Mail,
  School,
  Building2,
  LogIn,
  KeyRound,
  FileCheck2,
  ListTodo,
  Plus,
  ExternalLink,
  Github,
  GitPullRequest,
  Clock,
  Layers,
  Flame,
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import PostTaskModal from '@/components/PostTaskModal';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'company'>('student');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const user = session?.user;
  const isStudent = user?.role === 'student';
  const isCompany = user?.role === 'company';

  const handleOpenLogin = (role: 'student' | 'company') => {
    setSelectedRole(role);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Background Ambient Glows & Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] glow-radial-hero -z-10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-24 relative z-10">
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Creator Badge in Hero */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-full px-4 py-1.5 text-xs text-zinc-300 transition-all shadow-sm">
              <span className="text-emerald-400">✨</span>
              <span>Engineered by <strong className="text-white font-semibold">Tanishq Goyal</strong></span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-mono text-[11px]">Interactive Portfolio Sandbox</span>
            </span>
          </div>

          {/* Top Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs font-semibold text-zinc-300 shadow-inner mb-6 hover:border-white/20 transition-all">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-zinc-400">Next-Gen Builder Credentials</span>
            <span className="text-zinc-600">•</span>
            <span className="text-indigo-400 flex items-center gap-1 font-medium">
              Proof Over Paper <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* High-Contrast Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            Proof Over Paper:{' '}
            <span className="gradient-text">
              Earn Verified Skills Through Real Startup Tasks.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-9 font-normal">
            Students solve actual company backlog tickets, submit real pull requests and design specs, and collect cryptographic proof-of-work badges. Zero resume guesswork.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/feed"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Explore Micro-Tasks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => {
                if (isCompany) {
                  setIsPostModalOpen(true);
                } else {
                  handleOpenLogin('company');
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Post a Task</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-zinc-500 mb-16">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Auditable GitHub &amp; Figma Deliverables
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              Direct Startup Founder Verification
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Verifiable Skill Badges on Public URL
            </span>
          </div>

          {/* INTERACTIVE PREVIEW CARD (Simulated Tactile Badge Card) */}
          <div className="max-w-2xl mx-auto mb-20 text-left">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-indigo-950/40 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/15 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Card Header & Verifiable Hash Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Next.js Specialist</span>
                    </h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <span>Issued by</span>
                      <span className="text-zinc-200 font-semibold">DevStudio</span>
                      <span>•</span>
                      <span>1-Week Sprint</span>
                    </p>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographically Verified</span>
                  </span>
                </div>
              </div>

              {/* Deliverable Proof Snippet */}
              <div className="space-y-3 mb-5">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                      <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                      PR #42: Migrate REST to Next.js 14 App Router
                    </span>
                    <span className="text-emerald-400 font-bold">+1,240 / -312</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Edge Runtime • Strict Zod Validation • 100% Tests Passing
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-300 block mb-0.5">
                      Verified by Priya Sharma (Head of Engineering @ DevStudio):
                    </span>
                    <p className="italic text-zinc-300">
                      &ldquo;Phenomenal attention to edge performance and TypeScript typing. Verified deliverable and minted on-chain proof badge.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient & Inspect Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/[0.08] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-zinc-950 font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <div className="text-zinc-400">
                    Recipient:{' '}
                    <span className="text-white font-medium">Alex Chen</span>{' '}
                    <span className="text-zinc-500">(Apex Tech Institute)</span>
                  </div>
                </div>

                <Link
                  href="/profile/student-1"
                  className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold group-hover:translate-x-0.5 transition-all self-start sm:self-auto"
                >
                  <span>Inspect Student Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3-COLUMN BENTO GRID */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Built for Builders, Not Keyword Stuffers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Traditional hiring relies on resume buzzwords. SkillTish replaces guesswork with authentic company deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Real Micro-Tasks */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    No 6-Month Internships
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Real Micro-Tasks
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  1-day to 2-week actual company backlog tickets. Clear scope, bullet acceptance criteria, and real engineering challenges.
                </p>
              </div>

              {/* Visual Mockup for Card 1 */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Sprint Scopes</span>
                  <span className="text-amber-400 font-mono text-[11px]">Production Ready</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-semibold text-zinc-400">
                  <div className="p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">1 Day</div>
                  <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">3 Days</div>
                  <div className="p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">1 Wk</div>
                  <div className="p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">2 Wks</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Zero Fluff Verification */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <Code2 className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                    Direct Code Audits
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Zero Fluff Verification
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  Direct GitHub pull requests and Figma designs reviewed by founders. Actionable feedback and authentic quality standards.
                </p>
              </div>

              {/* Visual Mockup for Card 2 */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-zinc-400" />
                    PR Review Pipeline
                  </span>
                  <span className="text-emerald-400 text-[11px] font-semibold">Approved ✓</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full w-full" />
                </div>
              </div>
            </div>

            {/* Bento Card 3: Immutable Public Proof */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <Award className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Auditable Portfolios
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Immutable Public Proof
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  Shareable tamper-evident portfolio cards that recruiters can audit with 1-click links to code, comments, and approvals.
                </p>
              </div>

              {/* Visual Mockup for Card 3 */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <span className="text-zinc-300 font-mono text-[11px]">/profile/student-1</span>
                </div>
                <span className="text-emerald-400 font-semibold text-[11px]">Shareable</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORKSPACE / PERSONA DEMO SECTION */}
        <div className="max-w-4xl mx-auto">
          {status === 'authenticated' && user ? (
            /* AUTHENTICATED ACTIVE WORKSPACE */
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl shadow-black/60 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
                    Active Session Workspace
                  </span>
                </div>

                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isStudent
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shrink-0 ${
                    isStudent
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-zinc-950'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-700 text-white'
                  }`}
                >
                  {isStudent ? (
                    <GraduationCap className="w-7 h-7" />
                  ) : (
                    <Building className="w-7 h-7" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Welcome back, {user.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{user.email}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      {isStudent ? (
                        <>
                          <School className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-200 font-medium">{user.college}</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-zinc-200 font-medium">{user.company}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/[0.08]">
                {isStudent ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/feed"
                      className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.06] transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                          <ListTodo className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                            Explore Micro-Tasks
                          </div>
                          <div className="text-xs text-zinc-400">
                            Apply and build 1-14 day sprints
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={`/profile/${user.id || 'student-1'}`}
                      className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/50 hover:bg-white/[0.06] transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-teal-300 transition">
                            Public Portfolio
                          </div>
                          <div className="text-xs text-zinc-400">
                            View verified badges &amp; proof
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-white text-sm">
                            + Post a Micro-Task
                          </div>
                          <div className="text-xs text-indigo-100">
                            Create a 1 to 14 day scoped sprint for students
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link
                        href="/dashboard"
                        className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.06] transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                            <FileCheck2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                              Review Submissions
                            </div>
                            <div className="text-xs text-zinc-400">
                              Inspect PRs &amp; mint verified badges
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href="/feed"
                        className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.06] transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
                            <ListTodo className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-violet-300 transition">
                              Company Feed
                            </div>
                            <div className="text-xs text-zinc-400">
                              Browse active backlog openings
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* UNAUTHENTICATED DEMO PERSONAS */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Student Persona */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        Student Persona
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-0.5">
                      Alex Chen
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mb-3">
                      CS Junior • Apex Tech Institute
                    </p>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                      Tackles targeted 1-14 day startup micro-tasks, submits real PRs and Figma prototypes, and accumulates verified proof-of-work badges on a public portfolio.
                    </p>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-zinc-400 mb-5">
                      <div>Email: <span className="text-zinc-200">student@college.edu</span></div>
                      <div>Pass: <span className="text-zinc-200">password123</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLogin('student')}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Demo Sign In (Alex - Student)</span>
                  </button>
                </div>

                {/* Company Persona */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                        <Building className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                        Company Persona
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-0.5">
                      Priya Sharma
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium mb-3">
                      Engineering Lead • DevStudio
                    </p>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                      Posts scoped engineering challenges, evaluates incoming student deliverables, offers actionable feedback, and mints authenticated verifiable skill credentials.
                    </p>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono text-zinc-400 mb-5">
                      <div>Email: <span className="text-zinc-200">priya@devstudio.io</span></div>
                      <div>Pass: <span className="text-zinc-200">password123</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLogin('company')}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-950/40 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Demo Sign In (Priya - Company)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        defaultRole={selectedRole}
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
