'use client';

import React, { useState } from 'react';
import { X, Github, Figma, Send, Loader2, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react';
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

  const isGithub = proofUrl.includes('github.com');
  const isFigma = proofUrl.includes('figma.com');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!proofUrl.trim()) {
      setError('Please provide your GitHub repository or Figma file link.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            Proof-of-Work Submission
          </div>
          <h2 className="text-xl font-bold text-slate-900">Apply & Submit Work</h2>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
            Task: <span className="text-slate-700">{taskTitle}</span>
          </p>
        </div>

        {!session ? (
          <div className="text-center py-6">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              Student Sign-in Required
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Sign in with the Demo Student account (Alex Chen) to submit proof of work.
            </p>
            <button
              onClick={() =>
                signIn('credentials', {
                  email: 'student@college.edu',
                  callbackUrl: window.location.href,
                })
              }
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-sm"
            >
              Sign In as Alex Chen (Student)
            </button>
          </div>
        ) : success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Proof Submitted Successfully!
            </h3>
            <p className="text-sm text-slate-600">
              The startup poster will review your submission and issue your verified skill badge.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Work Proof Link (GitHub or Figma) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {isGithub ? (
                    <Github className="w-4 h-4 text-slate-900" />
                  ) : isFigma ? (
                    <Figma className="w-4 h-4 text-purple-600" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/alexchen/project or https://figma.com/file/..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-2">
                <span>Must be an accessible URL:</span>
                <span className="font-medium text-slate-700">GitHub repo / PR</span> or{' '}
                <span className="font-medium text-slate-700">Figma file link</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Implementation Notes & Methodology
              </label>
              <textarea
                rows={4}
                placeholder="Explain your approach, libraries used, test coverage, and any key architectural decisions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Work Proof</span>
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
