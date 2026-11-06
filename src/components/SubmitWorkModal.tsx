'use client';

import React, { useState } from 'react';
import {
  X,
  Github,
  Figma,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  ShieldCheck,
} from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { playClickSound } from '@/lib/sounds';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  onSubmitted?: () => void;
}

export default function SubmitWorkModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  onSubmitted,
}: SubmitWorkModalProps) {
  const { data: session } = useSession();
  const [proofUrl, setProofUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const urlLower = proofUrl.toLowerCase();
  const isGithub = urlLower.includes('github.com');
  const isFigma = urlLower.includes('figma.com');

  const handleResendVerification = async () => {
    playClickSound();
    setResending(true);
    setResendFeedback(null);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResendFeedback('[SENT] Verification link sent to inbox.');
      } else {
        setError(data.error || 'Failed to resend link.');
      }
    } catch {
      setError('Failed to resend link.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError(null);

    if (session?.user && session.user.isEmailVerified === false) {
      setError('Email verification required. Please verify your email address before submitting deliverables.');
      return;
    }

    if (!proofUrl.trim()) {
      setError('Please provide your GitHub pull request or Figma design link.');
      return;
    }

    if (!proofUrl.startsWith('http://') && !proofUrl.startsWith('https://')) {
      setError('Please provide a valid URL starting with https://');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          proofUrl: proofUrl.trim(),
          notes: notes.trim(),
          studentId: (session?.user as any)?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit work');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setProofUrl('');
        setNotes('');
        onClose();
        if (onSubmitted) onSubmitted();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#1B241B]/30 animate-in fade-in duration-150 font-sans">
      <div className="bg-[#FBFBF9] rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] relative text-[#1B241B]">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3E5239]" />
            <span>Proof-of-Work Submission</span>
          </div>
          <h2 className="text-xl font-bold text-[#1B241B] tracking-tight">Submit Deliverable</h2>
          <p className="text-xs text-[#525E50] mt-1 line-clamp-1">
            Project: <strong className="text-[#1B241B] font-semibold">{taskTitle}</strong>
          </p>
        </div>

        {!session ? (
          <div className="text-center py-6">
            <AlertCircle className="w-10 h-10 text-[#525E50]/60 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#1B241B] mb-1">
              Authentication Required
            </h3>
            <p className="text-xs text-[#525E50] mb-6 max-w-sm mx-auto font-normal">
              Sign in to submit pull requests and earn verified skill credentials.
            </p>
            <button
              onClick={() => {
                playClickSound();
                signIn('credentials', {
                  email: 'student@college.edu',
                  callbackUrl: window.location.href,
                });
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] font-medium text-xs shadow-sm transition cursor-pointer"
            >
              Sign In as Alex Chen (Student Demo)
            </button>
          </div>
        ) : success ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle className="w-8 h-8 text-[#3E5239]" />
            </div>
            <h3 className="text-lg font-bold text-[#1B241B] mb-1">
              Submission Recorded
            </h3>
            <p className="text-xs text-[#525E50] font-normal">
              Startup review leads will inspect your pull request and issue your verified credential.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Verification Gate Alert */}
            {session?.user && session.user.isEmailVerified === false && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Email Verification Required:</span>
                    <span>
                      Please verify email address (
                      <strong className="underline decoration-amber-300">{session.user.email}</strong>
                      ) before submitting deliverables.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="px-3 py-1 rounded-lg bg-white hover:bg-amber-100/60 border border-amber-300/80 font-medium text-[11px] text-amber-900 transition cursor-pointer shadow-sm"
                  >
                    {resending ? 'Sending...' : 'Resend Verification Link'}
                  </button>
                  {resendFeedback && (
                    <span className="text-[11px] font-medium text-amber-800">{resendFeedback}</span>
                  )}
                </div>
              </div>
            )}

            {/* Proof URL Input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Deliverable Proof Link (GitHub Pull Request or Figma) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isGithub ? (
                    <Github className="w-4 h-4 text-slate-800" />
                  ) : isFigma ? (
                    <Figma className="w-4 h-4 text-purple-600" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/org/repo/pull/42 or Figma URL"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Implementation Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Architecture &amp; Implementation Notes
              </label>
              <textarea
                rows={4}
                placeholder="Explain approach, dependencies, edge tests, and architectural decisions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none font-sans"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-medium transition cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || session?.user?.isEmailVerified === false}
                className="px-5 py-2 rounded-lg bg-[#344434] hover:bg-[#283528] disabled:bg-[#DEE3D7] disabled:text-[#525E50] disabled:cursor-not-allowed text-[#F4F6F1] text-xs font-medium shadow-sm active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit For Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
