'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  UserPlus,
  ShieldCheck,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import PostTaskModal from '@/components/PostTaskModal';
import { playClickSound } from '@/lib/sounds';
import { CREATOR_PROFILE } from '@/lib/creator';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<'student' | 'company'>('student');
  const [modalMode, setModalMode] = useState<'signin' | 'register'>('signin');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [copiedCreatorEmail, setCopiedCreatorEmail] = useState(false);
  const connectDropdownRef = useRef<HTMLDivElement>(null);

  // Close connect dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        connectDropdownRef.current &&
        !connectDropdownRef.current.contains(e.target as Node)
      ) {
        setIsConnectOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsConnectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Listen to open-login-modal and open-post-task-modal events
  useEffect(() => {
    const handleOpenLoginModal = (
      e: CustomEvent<{ role?: 'student' | 'company'; mode?: 'signin' | 'register' }>
    ) => {
      if (e.detail?.role) setModalRole(e.detail.role);
      if (e.detail?.mode) setModalMode(e.detail.mode);
      setIsLoginModalOpen(true);
    };

    const handleOpenPostModal = () => {
      const activeRole = session?.user?.role?.toLowerCase();
      if (activeRole === 'company' || activeRole === 'owner') {
        setIsPostModalOpen(true);
      }
    };

    window.addEventListener('open-login-modal' as any, handleOpenLoginModal as EventListener);
    window.addEventListener('open-post-task-modal' as any, handleOpenPostModal as EventListener);
    return () => {
      window.removeEventListener('open-login-modal' as any, handleOpenLoginModal as EventListener);
      window.removeEventListener('open-post-task-modal' as any, handleOpenPostModal as EventListener);
    };
  }, [session]);

  const user = session?.user;
  const role = session?.user?.role?.toLowerCase();
  const isStudent = role === 'student';
  const isCompany = role === 'company' || role === 'owner';

  const openAuth = (mode: 'signin' | 'register', defaultR: 'student' | 'company' = 'student') => {
    playClickSound();
    setModalMode(mode);
    setModalRole(defaultR);
    setIsLoginModalOpen(true);
  };

  const handleCopyCreatorEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    navigator.clipboard.writeText(CREATOR_PROFILE.email);
    setCopiedCreatorEmail(true);
    setTimeout(() => setCopiedCreatorEmail(false), 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E3E6DC] bg-[#FBFBF9]/90 backdrop-blur-md transition-all font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo: Organic Olive & Stone Emblem */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#2D3B2D] text-[#F4F6F1] flex items-center justify-center font-semibold shadow-sm group-hover:bg-[#1B241B] transition">
              <Award className="w-4 h-4 text-[#D5DEC9]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[#1B241B]">
                  SkillTish
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                  v2.0
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Links (Strict Role Isolation) */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Project Challenges (Shown to Students and Visitors, Hidden for Company) */}
            {!isCompany && (
              <Link
                href="/feed"
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  pathname === '/feed'
                    ? 'bg-[#EEF2EB] text-[#1B241B] font-semibold border border-[#D5DEC9]'
                    : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
                }`}
              >
                <Compass className="w-4 h-4 text-[#525E50]" />
                <span>Project Challenges</span>
              </Link>
            )}

            {/* Company Dashboard (Rendered ONLY if role is company or owner; COMPLETELY HIDDEN for students) */}
            {isCompany && (
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  pathname === '/dashboard'
                    ? 'bg-[#EEF2EB] text-[#1B241B] font-semibold border border-[#D5DEC9]'
                    : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#525E50]" />
                <span>Company Dashboard</span>
              </Link>
            )}

            {/* Profile Link */}
            <Link
              href={user?.id ? `/profile/${user.id}` : '/profile/student-1'}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                pathname.startsWith('/profile')
                  ? 'bg-[#EEF2EB] text-[#1B241B] font-semibold border border-[#D5DEC9]'
                  : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#525E50]" />
              <span>{status === 'authenticated' ? 'My Profile' : 'Developer Portfolio'}</span>
            </Link>
          </nav>

          {/* Right Action / Auth State */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Developer Support Dropdown Pill */}
            <div className="relative" ref={connectDropdownRef}>
              <button
                onClick={() => {
                  playClickSound();
                  setIsConnectOpen(!isConnectOpen);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer shadow-sm ${
                  isConnectOpen
                    ? 'bg-[#344434] text-[#F4F6F1] border-[#283528]'
                    : 'bg-white hover:bg-[#F4F6F1] text-[#374B35] border-[#E3E6DC]'
                }`}
                aria-label="Platform Feedback & Developer Support"
                aria-expanded={isConnectOpen}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4F6850]" />
                <span className="hidden sm:inline">Developer Support</span>
                <span className="sm:hidden">Support</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isConnectOpen ? 'rotate-180 text-[#F4F6F1]' : 'text-[#525E50]'
                  }`}
                />
              </button>

              {isConnectOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl border border-[#E4E8DE] bg-[#FBFBF9]/95 backdrop-blur-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#1B241B] font-sans">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E3E6DC]">
                    <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] text-[#F4F6F1] font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      TG
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#1B241B] truncate">
                          Tanishq Goyal
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#525E50] truncate">
                        Lead Developer &amp; Platform Architect
                      </p>
                    </div>
                  </div>

                  {/* Platform Feedback & Developer Support Label */}
                  <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-[#EEF2EB] border border-[#D5DEC9] text-[11px] font-semibold text-[#374B35] text-center">
                    Platform Feedback &amp; Developer Support
                  </div>

                  {/* Social & Contact Actions */}
                  <div className="py-2.5 space-y-2">
                    {/* GitHub */}
                    <a
                      href="https://github.com/goyaltanishq269-lgtm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#E4E8DE] hover:border-[#CCD5C3] bg-white hover:bg-[#F4F6F1] transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#2D3B2D] flex items-center justify-center text-white group-hover:bg-[#1B241B] transition">
                          <Github className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[#1B241B]">GitHub</span>
                          <span className="block text-[11px] text-[#525E50] font-mono">@goyaltanishq269-lgtm</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#525E50] group-hover:text-[#1B241B] transition" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/tanishq-goyal-a64279388/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#E4E8DE] hover:border-[#CCD5C3] bg-white hover:bg-[#F4F6F1] transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#3E5239] text-white flex items-center justify-center group-hover:bg-[#283528] transition">
                          <Linkedin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-[#1B241B]">LinkedIn</span>
                          <span className="block text-[11px] text-[#525E50] font-mono">tanishq-goyal</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#525E50] group-hover:text-[#1B241B] transition" />
                    </a>

                    {/* Support / Bug Report Email */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E4E8DE] bg-white hover:bg-[#F4F6F1] transition">
                      <a
                        href="mailto:goyaltanishq269@gmail.com"
                        className="flex items-center gap-2.5 min-w-0 flex-1 mr-2"
                        title="Send Support / Bug Report Email"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#EEF2EB] text-[#374B35] flex items-center justify-center shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-[#1B241B]">Support Email</span>
                          <span className="block text-[11px] text-[#525E50] font-mono truncate">goyaltanishq269@gmail.com</span>
                        </div>
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyCreatorEmail}
                        className="px-2 py-1 rounded-lg border border-[#D5DEC9] hover:bg-[#EEF2EB] text-[#525E50] hover:text-[#1B241B] text-[11px] font-medium transition cursor-pointer shrink-0"
                        title="Copy email address"
                      >
                        {copiedCreatorEmail ? (
                          <span className="text-[#374B35] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#374B35]" />
                            Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="w-3 h-3 text-[#525E50]" />
                            Copy
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="pt-2.5 border-t border-[#E3E6DC] flex items-center justify-between text-[11px] text-[#525E50]">
                    <span>SkillTish Architecture</span>
                    <span className="text-[#374B35] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F6850]"></span>
                      Available for support
                    </span>
                  </div>
                </div>
              )}
            </div>

            {status === 'authenticated' && user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Persona Pill */}
                {isStudent ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D5DEC9] bg-[#EEF2EB] text-[#374B35] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F6850]"></span>
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {user.name?.split(' ')[0] || 'Alex'} (Student)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D5DEC9] bg-[#344434] text-[#F4F6F1] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#739072]"></span>
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {user.name?.split(' ')[0] || 'Priya'} (Founder)
                    </span>
                  </div>
                )}

                {/* Company Action: Post Challenge */}
                {isCompany && (
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsPostModalOpen(true);
                    }}
                    className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-medium shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Challenge</span>
                  </button>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-[#E3E6DC] bg-white hover:bg-[#F4F6F1] text-[#525E50] hover:text-[#1B241B] text-xs font-medium transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* Unauthenticated CTAs */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('signin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E3E6DC] hover:bg-[#F4F6F1] text-[#1B241B] font-medium text-xs sm:text-sm shadow-sm transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#525E50]" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuth('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] font-medium text-xs sm:text-sm shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login / Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        defaultRole={modalRole}
        initialMode={modalMode}
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
