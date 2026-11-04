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
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent -z-10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-20">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>SkillTish • Proof-of-Work Micro-Tasks &amp; Verified Badges</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-6">
            Replace Resume Fluff With{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Verifiable Proof of Work
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            Students solve real-world startup micro-tasks and earn tamper-proof verified skill badges.
            Tech companies discover vetted builder talent with zero resume guesswork.
          </p>

          {/* Dynamic Content: Authenticated Workspace VS Unauthenticated Persona Callouts */}
          {status === 'authenticated' && user ? (
            /* AUTHENTICATED: Customized Workspace Actions without any quick switcher */
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl shadow-indigo-950/40 max-w-3xl mx-auto text-left">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                    Active Workspace
                  </span>
                </div>

                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isStudent
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                      : 'bg-indigo-950/80 text-indigo-400 border-indigo-700/60'
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {/* Persona Profile Summary */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shrink-0 ${
                    isStudent
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-900/30'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-700 text-white shadow-indigo-900/30'
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

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{user.email}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      {isStudent ? (
                        <>
                          <School className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-300 font-medium">{user.college}</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-300 font-medium">{user.company}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Persona-Specific Workspace Actions */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                  {isStudent ? 'Student Workspace Actions' : 'Company Management Actions'}
                </h4>

                {isStudent ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      href="/feed"
                      className="group p-4 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                          <ListTodo className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                            Explore Micro-Tasks
                          </div>
                          <div className="text-xs text-slate-400">
                            Apply and build 1-14 day sprints
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={`/profile/${user.id || 'student-1'}`}
                      className="group p-4 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-teal-300 transition">
                            Student Portfolio
                          </div>
                          <div className="text-xs text-slate-400">
                            View verified skill badges
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Primary Company Post Task Trigger */}
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="w-full p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition flex items-center justify-between group cursor-pointer"
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
                        className="group p-4 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                            <FileCheck2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                              Review Submissions
                            </div>
                            <div className="text-xs text-slate-400">
                              Inspect PRs &amp; mint verified badges
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href="/feed"
                        className="group p-4 rounded-2xl bg-slate-850/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
                            <ListTodo className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-violet-300 transition">
                              Company Tasks Feed
                            </div>
                            <div className="text-xs text-slate-400">
                              Browse active openings
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* UNAUTHENTICATED: Callouts explaining both personas & Open Demo Sign In buttons */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Student Persona Callout */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xl shadow-black/40">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                        Student Persona
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">
                      Alex Chen
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      CS Junior • Apex Tech Institute
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Tackles targeted 1-14 day startup micro-tasks, submits real PRs and Figma prototypes, and accumulates verified proof-of-work badges on a public portfolio.
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 mb-4">
                      <div>Email: <span className="text-slate-200">student@college.edu</span></div>
                      <div>Pass: <span className="text-slate-200">password123</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLogin('student')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Demo Sign In (Student)</span>
                  </button>
                </div>

                {/* Company Persona Callout */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xl shadow-black/40">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                        <Building className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-full">
                        Company Persona
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">
                      Priya Sharma
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mb-3">
                      Engineering Lead • DevStudio
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      Posts scoped engineering challenges, evaluates incoming student deliverables, offers actionable feedback, and mints authenticated verifiable skill credentials.
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 mb-4">
                      <div>Email: <span className="text-slate-200">priya@devstudio.io</span></div>
                      <div>Pass: <span className="text-slate-200">password123</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLogin('company')}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-900/20 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Demo Sign In (Company)</span>
                  </button>
                </div>
              </div>

              {/* Central Trigger Button */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => handleOpenLogin('student')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-white font-bold text-xs transition shadow-lg cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  <span>Open Demo Sign In Modal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Value Pillars Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">1 to 14 Day Sprints</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              No unpaid 6-month internships. Focused micro-tasks scoped to 1 day, 3 days, 1 week, or 2 weeks with clear acceptance criteria.
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">GitHub &amp; Figma Proof</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Students submit direct PR links, code repositories, or interactive Figma prototypes. Real deliverables speak louder than resume keywords.
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Verified Skill Badges</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Companies review submissions and issue authenticated skill badges that appear permanently on the student&apos;s public portfolio.
            </p>
          </div>
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
