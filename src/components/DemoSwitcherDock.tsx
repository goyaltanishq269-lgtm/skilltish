'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import {
  User,
  Building,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

export default function DemoSwitcherDock() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingPersona, setLoadingPersona] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSwitchToStudent = async () => {
    playClickSound();
    setLoadingPersona('student');
    try {
      const res = await signIn('credentials', {
        email: DEMO_ACCOUNTS.student.email,
        password: DEMO_ACCOUNTS.student.password,
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
        email: DEMO_ACCOUNTS.company.email,
        password: DEMO_ACCOUNTS.company.password,
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

  const currentEmail = session?.user?.email;
  const isAlex = currentEmail === 'student@college.edu';
  const isPriya = currentEmail === 'priya@devstudio.io';

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 z-50 p-3 rounded-xl bg-[#FBFBF9] border border-[#E4E8DE] text-[#1B241B] text-xs font-medium shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FLOATING DOCK */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-1.5 p-1.5 rounded-full border border-[#E4E8DE] bg-[#FBFBF9]/95 backdrop-blur-xl shadow-lg select-none text-[#1B241B] text-xs">
        {/* Label clearly designated for evaluators */}
        <div className="hidden lg:flex items-center gap-1.5 pl-3 pr-1 text-[11px] font-semibold text-[#525E50]">
          <Terminal className="w-3.5 h-3.5 text-[#3E5239]" />
          <span>Demo Persona:</span>
        </div>

        {/* Pill 1: Student (Alex) */}
        <button
          onClick={handleSwitchToStudent}
          disabled={loadingPersona !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
            isAlex
              ? 'bg-[#344434] text-[#F4F6F1] shadow-sm'
              : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
          }`}
          title="Switch to Student Persona (Alex Chen)"
        >
          {loadingPersona === 'student' ? (
            <Loader2 className="w-3 h-3 animate-spin text-current" />
          ) : (
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAlex ? 'bg-[#D5DEC9]' : 'bg-[#CCD5C3]'
              }`}
            />
          )}
          <User className="w-3.5 h-3.5" />
          <span>Alex (Student)</span>
        </button>

        {/* Pill 2: Company (Priya) */}
        <button
          onClick={handleSwitchToCompany}
          disabled={loadingPersona !== null}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
            isPriya
              ? 'bg-[#2D3B2D] text-[#F4F6F1] shadow-sm'
              : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
          }`}
          title="Switch to Company Reviewer Persona (Priya Sharma)"
        >
          {loadingPersona === 'company' ? (
            <Loader2 className="w-3 h-3 animate-spin text-current" />
          ) : (
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPriya ? 'bg-[#A8E6CF]' : 'bg-[#CCD5C3]'
              }`}
            />
          )}
          <Building className="w-3.5 h-3.5" />
          <span>Priya (Reviewer)</span>
        </button>

        {/* Separator */}
        <div className="h-4 w-px bg-[#E3E6DC] mx-0.5" />

        {/* Pill 3: Reset Demo Data */}
        <button
          onClick={handleResetData}
          disabled={seeding}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE] transition cursor-pointer"
          title="Reset database with fresh seed tasks & credentials"
        >
          {seeding ? (
            <Loader2 className="w-3 h-3 animate-spin text-[#3E5239]" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5 text-[#525E50]" />
          )}
          <span className="hidden sm:inline text-xs">Reset</span>
        </button>

      </div>
    </>
  );
}
