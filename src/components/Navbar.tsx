'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Award,
  Briefcase,
  Compass,
  UserCheck,
  LogOut,
  LogIn,
  Plus,
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import PostTaskModal from '@/components/PostTaskModal';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<'student' | 'company'>('student');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Listen to open-login-modal and open-post-task-modal events
  useEffect(() => {
    const handleOpenLoginModal = (e: CustomEvent<{ role?: 'student' | 'company' }>) => {
      if (e.detail?.role) {
        setModalRole(e.detail.role);
      }
      setIsLoginModalOpen(true);
    };

    const handleOpenPostModal = () => {
      setIsPostModalOpen(true);
    };

    window.addEventListener('open-login-modal' as any, handleOpenLoginModal as EventListener);
    window.addEventListener('open-post-task-modal' as any, handleOpenPostModal as EventListener);
    return () => {
      window.removeEventListener('open-login-modal' as any, handleOpenLoginModal as EventListener);
      window.removeEventListener('open-post-task-modal' as any, handleOpenPostModal as EventListener);
    };
  }, []);

  const user = session?.user;
  const isStudent = user?.role === 'student';
  const isCompany = user?.role === 'company';

  return (
    <>
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <header className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-zinc-950/75 backdrop-blur-md px-4 sm:px-6 py-3 shadow-2xl shadow-black/60 transition-all">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-indigo-300 transition-colors">
                  SkillTish
                </span>
                <span className="block text-[9px] uppercase tracking-wider font-bold text-indigo-400 -mt-1">
                  Proof of Work
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/feed"
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  pathname === '/feed'
                    ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Micro-Tasks</span>
              </Link>

              <Link
                href="/dashboard"
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  pathname === '/dashboard'
                    ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Company Dashboard</span>
              </Link>

              <Link
                href={user?.id ? `/profile/${user.id}` : '/profile/student-1'}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  pathname.startsWith('/profile')
                    ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Student Portfolio</span>
              </Link>
            </nav>

            {/* Right Action / Auth State */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {status === 'authenticated' && user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Distinctive Role Indicators */}
                  {isStudent ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/25 bg-emerald-950/40 text-emerald-300 text-xs font-semibold shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                      </span>
                      <span className="truncate max-w-[110px] sm:max-w-none">
                        Student ({user.name?.split(' ')[0] || 'Alex'})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/25 bg-indigo-950/40 text-indigo-300 text-xs font-semibold shadow-[0_0_15px_-3px_rgba(99,102,241,0.25)]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span>
                      </span>
                      <span className="truncate max-w-[110px] sm:max-w-none">
                        Company ({user.name?.split(' ')[0] || 'Priya'})
                      </span>
                    </div>
                  )}

                  {/* Company Quick Action: + Post Task */}
                  {isCompany && (
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Task</span>
                    </button>
                  )}

                  {/* Sign Out Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-zinc-400 text-xs font-medium transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated: Sleek Sign In Trigger */
                <button
                  onClick={() => {
                    setModalRole('student');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs sm:text-sm shadow-md transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-900" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        defaultRole={modalRole}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Post Task Modal */}
      <PostTaskModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </>
  );
}
