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
  Share2,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Task Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested micro-task does not exist or may have been removed.
        </p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>
      </div>
    );
  }

  const durationColors: Record<string, string> = {
    '1 day': 'bg-amber-50 text-amber-700 border-amber-200',
    '3 days': 'bg-blue-50 text-blue-700 border-blue-200',
    '1 week': 'bg-purple-50 text-purple-700 border-purple-200',
    '2 weeks': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const user = session?.user as any;

  const userSubmission = task.submissions?.find(
    (s: any) =>
      String(s.studentId?._id || s.studentId) === String(user?.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Micro-Task Feed</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  durationColors[task.duration] || 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {task.duration} Sprint
              </span>

              {task.status === 'open' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Accepting Submissions
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Closed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              {task.title}
            </h1>

            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed mb-6 whitespace-pre-line">
              {task.description}
            </div>

            {/* Acceptance Criteria */}
            {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Acceptance Criteria
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {task.acceptanceCriteria.map((criterion: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Skills Evaluated & Credentialed
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.skillsRequired.map((skill: string) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {userSubmission && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your Submission Status:
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      userSubmission.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : userSubmission.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {userSubmission.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Submitted {new Date(userSubmission.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <a
                    href={userSubmission.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline break-all"
                  >
                    {userSubmission.proofUrl}
                  </a>
                </div>
                {userSubmission.notes && (
                  <p className="text-slate-600 italic">&ldquo;{userSubmission.notes}&rdquo;</p>
                )}
                {userSubmission.feedback && (
                  <p className="text-emerald-700 font-medium pt-1">
                    Poster Feedback: &ldquo;{userSubmission.feedback}&rdquo;
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 rounded-3xl border border-indigo-100 p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Proof-of-Work Guidelines
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Submit public GitHub repository, pull request, or Figma view/inspect link.</li>
              <li>Include documentation or inline comments explaining your approach.</li>
              <li>Upon approval by the poster, your verified badge is minted immediately to your public portfolio.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm sticky top-24">
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Verified Credential Awarded
              </span>
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>{task.stipendOrPerks || task.reward || 'Verified Skill Badge'}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-xs text-slate-600">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold text-slate-800">{task.duration}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Submissions</span>
                <span className="font-semibold text-slate-800">
                  {task.submissionCount ?? task.submissions?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Verification</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Guaranteed Badge
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Apply & Submit Work</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              Accepts GitHub repos or Figma prototypes.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Posted By
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                {task.poster?.name?.[0] || 'P'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {task.posterName || task.poster?.name || 'Priya Sharma'}
                </h4>
                <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  <span>{task.companyName || task.poster?.company || 'DevStudio'}</span>
                </div>
              </div>
            </div>

            {task.poster?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {task.poster.bio}
              </p>
            )}
          </div>
        </div>
      </div>

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
  );
}
