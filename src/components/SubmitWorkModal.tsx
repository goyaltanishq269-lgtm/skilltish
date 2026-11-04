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
  Sparkles,
  GitPullRequest,
} from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';

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

  if (!isOpen) return null;

  const urlLower = proofUrl.toLowerCase();
  const isGithub = urlLower.includes('github.com');
  const isFigma = urlLower.includes('figma.com');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!proofUrl.trim()) {
      setError('Please provide your GitHub repository, pull request, or Figma link.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/10 shadow-2xl relative bg-[#0d0d12]/95 backdrop-blur-2xl">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proof-of-Work Verification</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Apply &amp; Submit Work</h2>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
            Task: <span className="text-zinc-200 font-medium">{taskTitle}</span>
          </p>
        </div>

        {!session ? (
          <div className="text-center py-6">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              Student Sign-In Required
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
              Sign in with the student account (Alex Chen) to submit proof of work and claim badges.
            </p>
            <button
              onClick={() =>
                signIn('credentials', {
                  email: 'student@college.edu',
                  callbackUrl: window.location.href,
                })
              }
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              Sign In as Alex Chen (Student)
            </button>
          </div>
        ) : success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Proof Submitted Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              The startup poster will review your deliverable and mint your verified skill badge.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Proof URL Input with Auto-Detection Icon */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                Work Proof Link (GitHub or Figma) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {isGithub ? (
                    <Github className="w-4 h-4 text-emerald-400" />
                  ) : isFigma ? (
                    <Figma className="w-4 h-4 text-purple-400" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/alexchen/pr-42 or https://figma.com/file/..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-black/40 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition font-normal"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-2">
                <span>Must be an accessible URL:</span>
                <span className="font-medium text-zinc-300">GitHub repo / PR</span> or{' '}
                <span className="font-medium text-zinc-300">Figma prototype</span>
              </p>
            </div>

            {/* Implementation Notes & Methodology Textarea */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                Implementation Notes &amp; Architectural Approach
              </label>
              <textarea
                rows={4}
                placeholder="Explain your approach, libraries used, test coverage, and any key architectural decisions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-black/40 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition resize-none font-normal"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for Verification</span>
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
