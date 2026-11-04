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
  GraduationCap,
  Building,
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SkillTish
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-indigo-400 -mt-1">
                  Proof of Work
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                href="/feed"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname === '/feed'
                    ? 'bg-slate-850 text-indigo-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Micro-Tasks</span>
              </Link>

              <Link
                href="/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname === '/dashboard'
                    ? 'bg-slate-850 text-indigo-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Company Dashboard</span>
              </Link>

              <Link
                href={user?.id ? `/profile/${user.id}` : '/profile/student-1'}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/profile')
                    ? 'bg-slate-850 text-indigo-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Student Portfolio</span>
              </Link>
            </nav>

            {/* Right Action / Auth State */}
            <div className="flex items-center space-x-3">
              {status === 'authenticated' && user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Company Quick Action: + Post Task */}
                  {isCompany && (
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Post Task</span>
                    </button>
                  )}

                  {/* Authenticated User Display */}
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ring-2 ${
                        isStudent
                          ? 'bg-emerald-950 text-emerald-300 ring-emerald-500/40'
                          : 'bg-indigo-950 text-indigo-300 ring-indigo-500/40'
                      }`}
                    >
                      {user.name?.[0] || 'U'}
                    </div>

                    <div className="hidden sm:block text-left text-xs leading-tight">
                      <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
                        <span>{user.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                            isStudent
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                              : 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] truncate max-w-[140px] mt-0.5">
                        {isStudent ? user.college : user.company}
                      </div>
                    </div>
                  </div>

                  {/* Explicit Log Out Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-rose-950/40 hover:border-rose-800/60 text-slate-300 hover:text-rose-300 text-xs font-semibold transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated: Clean Sign In Button */
                <button
                  onClick={() => {
                    setModalRole('student');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

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
