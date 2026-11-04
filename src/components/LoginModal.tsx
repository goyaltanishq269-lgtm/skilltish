'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  X,
  GraduationCap,
  Building,
  KeyRound,
  Sparkles,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'student' | 'company';
}

export default function LoginModal({
  isOpen,
  onClose,
  defaultRole = 'student',
}: LoginModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'student' | 'company'>(defaultRole);
  const [email, setEmail] = useState(DEMO_ACCOUNTS[defaultRole].email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[defaultRole].password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync tab with defaultRole when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultRole);
      setEmail(DEMO_ACCOUNTS[defaultRole].email);
      setPassword(DEMO_ACCOUNTS[defaultRole].password);
      setError(null);
    }
  }, [isOpen, defaultRole]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTabSwitch = (tab: 'student' | 'company') => {
    setActiveTab(tab);
    setEmail(DEMO_ACCOUNTS[tab].email);
    setPassword(DEMO_ACCOUNTS[tab].password);
    setError(null);
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ACCOUNTS[activeTab].email);
    setPassword(DEMO_ACCOUNTS[activeTab].password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError('Invalid email or password. Please use the demo credentials.');
        setLoading(false);
        return;
      }

      onClose();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate. Please try again.');
      setLoading(false);
    }
  };

  const isStudentTab = activeTab === 'student';
  const targetDemo = DEMO_ACCOUNTS[activeTab];
  const targetOrg =
    activeTab === 'student' ? DEMO_ACCOUNTS.student.college : DEMO_ACCOUNTS.company.company;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-indigo-950/60 overflow-hidden text-slate-100 animate-scale-up"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 id="login-modal-title" className="text-lg font-bold text-white leading-tight">
                Sign In to SkillTish
              </h2>
              <p className="text-xs text-slate-400">
                Verifiable micro-tasks &amp; authenticated credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabSwitch('student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                isStudentTab
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('company')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                !isStudentTab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Company Login</span>
            </button>
          </div>
        </div>

        {/* Demo Credentials Pill / Helper */}
        <div className="px-6 pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">
                  Demo Persona: <strong className="text-white">{targetDemo.name}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {targetOrg} • Pass: {targetDemo.password}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 transition flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Fill Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isStudentTab ? 'student@college.edu' : 'priya@devstudio.io'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer ${
              isStudentTab
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In as {isStudentTab ? 'Student' : 'Company'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
