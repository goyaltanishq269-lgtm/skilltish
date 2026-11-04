'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import {
  User,
  Building,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { isMuted, toggleMute, playClickSound } from '@/lib/sounds';

export default function DemoSwitcherDock() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingPersona, setLoadingPersona] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
    const handleSoundChange = (e: any) => {
      setMutedState(e.detail?.muted ?? isMuted());
    };
    window.addEventListener('skilltish-sound-change', handleSoundChange);
    return () => {
      window.removeEventListener('skilltish-sound-change', handleSoundChange);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSwitchToStudent = async () => {
    playClickSound();
    setLoadingPersona('student');
    try {
      const res = await signIn('credentials', {
        email: 'student@college.edu',
        password: 'password123',
        redirect: false,
      });
      if (res?.ok) {
        showToast('Switched to Alex Chen (Student)');
        router.push('/feed');
        router.refresh();
      } else {
        showToast('Failed to switch persona');
      }
    } catch {
      showToast('Error switching persona');
    } finally {
      setLoadingPersona(null);
    }
  };

  const handleSwitchToCompany = async () => {
    playClickSound();
    setLoadingPersona('company');
    try {
      const res = await signIn('credentials', {
        email: 'priya@devstudio.io',
        password: 'password123',
        redirect: false,
      });
      if (res?.ok) {
        showToast('Switched to Priya Sharma (Company / Reviewer)');
        router.push('/dashboard');
        router.refresh();
      } else {
        showToast('Failed to switch persona');
      }
    } catch {
      showToast('Error switching persona');
    } finally {
      setLoadingPersona(null);
    }
  };

  const handleResetData = async () => {
    playClickSound();
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) {
        showToast('Demo Data Re-seeded Successfully');
        router.refresh();
      } else {
        showToast('Seed reset failed');
      }
    } catch {
      showToast('Seed reset error');
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleSound = () => {
    const next = toggleMute();
    setMutedState(next);
    if (!next) {
      playClickSound();
    }
  };

  const currentEmail = session?.user?.email;
  const isAlex = currentEmail === 'student@college.edu';
  const isPriya = currentEmail === 'priya@devstudio.io';

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 z-50 p-3 rounded-xl bg-zinc-900/95 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FLOATING DOCK */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl border border-white/10 bg-zinc-950/85 backdrop-blur-xl shadow-2xl select-none">
        {/* Label indicator for evaluators */}
        <div className="hidden md:flex items-center gap-1 pl-2 pr-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Demo:</span>
        </div>

        {/* Pill 1: Student (Alex) */}
        <button
          onClick={handleSwitchToStudent}
          disabled={loadingPersona !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            isAlex
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
          }`}
          title="Switch to Student Persona (Alex Chen)"
        >
          {loadingPersona === 'student' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          ) : (
            <span
              className={`w-2 h-2 rounded-full ${
                isAlex ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
              }`}
            />
          )}
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span>Student</span>
        </button>

        {/* Pill 2: Company (Priya) */}
        <button
          onClick={handleSwitchToCompany}
          disabled={loadingPersona !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            isPriya
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-zinc-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
          }`}
          title="Switch to Company Reviewer Persona (Priya Sharma)"
        >
          {loadingPersona === 'company' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          ) : (
            <span
              className={`w-2 h-2 rounded-full ${
                isPriya ? 'bg-indigo-400 animate-pulse' : 'bg-zinc-600'
              }`}
            />
          )}
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          <span>Company</span>
        </button>

        {/* Separator */}
        <div className="h-4 w-px bg-white/10 mx-0.5" />

        {/* Pill 3: Reset Demo Data */}
        <button
          onClick={handleResetData}
          disabled={seeding}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition cursor-pointer"
          title="Reset database with fresh seed tasks & credentials"
        >
          {seeding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="hidden sm:inline text-[11px]">Reset</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
          title={muted ? 'Unmute Sound FX' : 'Mute Sound FX'}
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </div>
    </>
  );
}
