'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SubmitWorkModal from '@/components/SubmitWorkModal';
import {
  Clock,
  Building,
  Award,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Github,
  Figma,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  FileCheck2,
  Building2,
  ListTodo,
} from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();

  const [task, setTask] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const fetchTask = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${id}`);
      if (!res.ok) {
        throw new Error('Task not found');
      }
      const data = await res.json();
      setTask(data);
    } catch (err: any) {
      setError(err.message || 'Error loading task');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] bg-[#09090b] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-400">Loading task specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] bg-[#09090b] flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-white/10 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Task Not Found</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6">
            The requested micro-task does not exist or may have been removed.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Backlog Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  const durationUpper = (task.duration || '3 days').toUpperCase();
  const durationBadgeStyle: Record<string, string> = {
    '1 DAY': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    '3 DAYS': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    '1 WEEK': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    '2 WEEKS': 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };

  const badgeStyle =
    durationBadgeStyle[durationUpper] || 'bg-white/[0.05] text-zinc-300 border-white/10';

  const user = session?.user as any;
  const userSubmission = task.submissions?.find(
    (s: any) => String(s.studentId?._id || s.studentId) === String(user?.id)
  );

  const company =
    task.companyName || task.poster?.company || task.posterName || task.poster?.name || 'DevStudio';
  const posterName = task.posterName || task.poster?.name || 'Priya Sharma';

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-zinc-100">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Startup Backlog Feed</span>
          </Link>
        </div>

        {/* TWO-COLUMN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Main Task Specifications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
              {/* Sprint Badge + Status */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider border ${badgeStyle}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {durationUpper} SPRINT
                </span>

                {task.status === 'open' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    Accepting Deliverables
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Closed
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-5 leading-tight">
                {task.title}
              </h1>

              {/* Detailed Description */}
              <div className="text-sm text-zinc-300 leading-relaxed mb-8 whitespace-pre-line font-normal">
                {task.description}
              </div>

              {/* Numbered Acceptance Criteria Checklist */}
              {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <span>Acceptance Criteria</span>
                  </h3>
                  <div className="space-y-2.5">
                    {task.acceptanceCriteria.map((criterion: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]"
                      >
                        <div className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {criterion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Evaluated & Credentialed */}
              <div className="pt-6 border-t border-white/[0.08]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Skills Evaluated &amp; Credentialed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {task.skillsRequired.map((skill: string) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-3 py-1 rounded-xl bg-white/[0.04] text-zinc-200 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* User Submission Status Card if Submitted */}
            {userSubmission && (
              <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-md">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Your Submission:
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        userSubmission.status === 'approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : userSubmission.status === 'rejected'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {userSubmission.status}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(userSubmission.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-4 bg-black/40 rounded-2xl border border-white/[0.06] text-xs text-zinc-300 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <a
                      href={userSubmission.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline break-all"
                    >
                      {userSubmission.proofUrl}
                    </a>
                  </div>
                  {userSubmission.notes && (
                    <p className="text-zinc-400 italic pt-1">&ldquo;{userSubmission.notes}&rdquo;</p>
                  )}
                  {userSubmission.feedback && (
                    <div className="pt-2 text-emerald-300 flex items-start gap-2 border-t border-white/[0.06]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Founder Feedback:</strong> &ldquo;{userSubmission.feedback}&rdquo;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Proof-of-Work Guidelines */}
            <div className="glass-card rounded-3xl p-6 border border-indigo-500/20 bg-indigo-950/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Proof-of-Work Guidelines</span>
              </h3>
              <ul className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Submit a public GitHub pull request link or an interactive Figma inspect link.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Include concise implementation notes explaining your architectural decisions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>Upon founder approval, an authenticated badge is minted immediately to your public portfolio.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Company Brief & Founder Card */}
          <div className="space-y-6">
            {/* Sticky Brief Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl sticky top-24">
              <div className="mb-5">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2 font-mono">
                  Verified Credential Awarded
                </span>
                <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-sm bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
                  <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{task.stipendOrPerks || task.reward || 'Verified Skill Badge'}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-xs text-zinc-400">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">Sprint Duration</span>
                  <span className="font-semibold text-white font-mono">{durationUpper}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">Submissions Audited</span>
                  <span className="font-semibold text-white">
                    {task.submissionCount ?? task.submissions?.length ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-zinc-500">Verification Type</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cryptographic Badge
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Apply &amp; Submit Work</span>
              </button>

              <p className="text-[11px] text-zinc-500 text-center mt-3 font-normal">
                Accepts GitHub PRs and Figma inspect links.
              </p>
            </div>

            {/* Posted By Founder Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 font-mono">
                Posted By
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md">
                  {posterName[0] || 'P'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {posterName}
                  </h4>
                  <div className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{company}</span>
                  </div>
                </div>
              </div>

              {task.poster?.bio ? (
                <p className="text-xs text-zinc-400 leading-relaxed pt-3 border-t border-white/[0.06]">
                  {task.poster.bio}
                </p>
              ) : (
                <p className="text-xs text-zinc-400 leading-relaxed pt-3 border-t border-white/[0.06]">
                  Engineering Lead at {company}. Discovering ambitious student builders via verifiable proof-of-work.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Work Submission Modal */}
        <SubmitWorkModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          taskId={task._id}
          taskTitle={task.title}
          onSubmitted={() => {
            fetchTask();
          }}
        />
      </div>
    </div>
  );
}
