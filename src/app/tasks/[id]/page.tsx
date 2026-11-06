'use client';

export const dynamic = 'force-dynamic';

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
  Terminal,
  GitPullRequest,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

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
      <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBF9] flex items-center justify-center p-4 font-sans">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#3E5239] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#525E50]">Loading challenge specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBF9] flex items-center justify-center p-4 font-sans">
        <div className="bg-white/90 rounded-xl p-8 max-w-md w-full border border-[#E4E8DE] shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1B241B] mb-2">Challenge Not Found</h2>
          <p className="text-xs text-[#525E50] mb-6 font-normal">
            The requested project challenge does not exist or has been archived.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-medium shadow-sm transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Challenges Feed</span>
          </Link>
        </div>
      </div>
    );
  }

  const durationUpper = (task.duration || '3 days').toUpperCase();
  const durationBadgeColor: Record<string, string> = {
    '1 DAY': 'bg-[#EEF2EB] text-[#374B35] border-[#D5DEC9]',
    '3 DAYS': 'bg-[#F4F6F1] text-[#3E5239] border-[#D5DEC9]',
    '1 WEEK': 'bg-[#F2F4EE] text-[#414E3F] border-[#DEE3D7]',
    '2 WEEKS': 'bg-[#EDEFE6] text-[#2D3B2D] border-[#CCD5C3]',
  };

  const badgeColor =
    durationBadgeColor[durationUpper] || 'bg-[#F2F4EE] text-[#414E3F] border-[#DEE3D7]';

  const user = session?.user as any;
  const userSubmission = task.submissions?.find(
    (s: any) => String(s.studentId?._id || s.studentId) === String(user?.id)
  );

  const company =
    task.companyName || task.poster?.company || task.posterName || task.poster?.name || 'DevStudio';
  const posterName = task.posterName || task.poster?.name || 'Priya Sharma';

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBFBF9] text-[#1B241B] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525E50] hover:text-[#1B241B] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Challenges Feed</span>
          </Link>
        </div>

        {/* TWO-COLUMN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Main Task Specifications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)]">
              {/* Challenge Badge + Status */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {task.duration || '3 days'}
                </span>

                {task.status === 'open' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Accepting Deliverables
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F2F4EE] text-[#525E50] border border-[#DEE3D7]">
                    Completed
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1B241B] tracking-tight mb-5 leading-tight">
                {task.title}
              </h1>

              {/* Detailed Description */}
              <div className="text-xs sm:text-sm text-[#525E50] leading-relaxed mb-8 whitespace-pre-line font-normal">
                {task.description}
              </div>

              {/* Numbered Acceptance Criteria Checklist */}
              {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525E50] mb-3 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#3E5239]" />
                    <span>Acceptance Criteria</span>
                  </h3>
                  <div className="space-y-2">
                    {(task?.acceptanceCriteria ?? []).map((criterion: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE]"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium">
                          {idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-[#1B241B] leading-relaxed">
                          {criterion}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Evaluated & Credentialed */}
              <div className="pt-6 border-t border-[#E4E8DE]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525E50] mb-3">
                  Skills Evaluated &amp; Credentialed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(task?.skillsRequired ?? []).map((skill: string) => (
                    <span
                      key={skill}
                      className="font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2.5 py-0.5 rounded border border-[#DEE3D7]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* User Submission Status Card if Submitted */}
            {userSubmission && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E4E8DE]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#525E50]">
                      Your Deliverable:
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                        userSubmission.status === 'approved'
                          ? 'bg-[#EEF2EB] text-[#374B35] border-[#D5DEC9]'
                          : userSubmission.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                          : 'bg-amber-50 text-amber-700 border-amber-200/60'
                      }`}
                    >
                      {userSubmission.status}
                    </span>
                  </div>
                  <span className="text-xs text-[#525E50] font-medium">
                    {new Date(userSubmission.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-4 bg-[#F8F9F5] rounded-xl border border-[#E4E8DE] text-xs text-[#1B241B] space-y-2">
                  <div className="font-medium text-[#1B241B] flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7]">
                      <GitPullRequest className="w-3.5 h-3.5 text-[#3E5239]" />
                      <span>PR Proof</span>
                    </span>
                    <a
                      href={userSubmission.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3E5239] hover:text-[#2D3B2D] hover:underline break-all inline-flex items-center gap-1 text-xs"
                    >
                      <span>{userSubmission.proofUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                  {userSubmission.notes && (
                    <p className="text-[#525E50] italic pt-1">&ldquo;{userSubmission.notes}&rdquo;</p>
                  )}
                  {userSubmission.feedback && (
                    <div className="pt-2 text-[#1B241B] flex items-start gap-2 border-t border-[#E4E8DE] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        Founder Feedback: &ldquo;{userSubmission.feedback}&rdquo;
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Proof-of-Work Guidelines */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)]">
              <h3 className="text-sm font-semibold text-[#1B241B] flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#3E5239]" />
                <span>Proof-of-Work Standards</span>
              </h3>
              <ul className="text-xs text-[#525E50] space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E5239] mt-1.5 shrink-0" />
                  <span>Submit an active GitHub pull request link or an interactive Figma inspect link.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E5239] mt-1.5 shrink-0" />
                  <span>Include concise implementation notes explaining your architectural decisions and testing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E5239] mt-1.5 shrink-0" />
                  <span>Upon founder approval, an authenticated credential is minted immediately to your public portfolio.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Company Brief & Submit Box */}
          <div className="space-y-6">
            {/* Sticky Action Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] sticky top-24">
              <div className="mb-5">
                <span className="text-xs font-semibold text-[#525E50] uppercase tracking-wider block mb-2">
                  Verified Credential Awarded
                </span>
                <div className="flex items-center gap-2.5 text-[#2D3B2D] font-semibold text-sm bg-[#EEF2EB] p-3 rounded-xl border border-[#D5DEC9]">
                  <Award className="w-5 h-5 text-[#3E5239] shrink-0" />
                  <span>{task.stipendOrPerks || task.reward || 'Verified Skill Badge'}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-xs text-[#525E50]">
                <div className="flex items-center justify-between py-2 border-b border-[#E4E8DE]">
                  <span>Duration</span>
                  <span className="font-medium text-[#1B241B]">{task.duration || '3 days'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E4E8DE]">
                  <span>Deliverables Audited</span>
                  <span className="font-medium text-[#1B241B]">
                    {task.submissionCount ?? task.submissions?.length ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E4E8DE]">
                  <span>Verification Type</span>
                  <span className="font-medium text-[#374B35] flex items-center gap-1.5 bg-[#EEF2EB] px-2 py-0.5 rounded-full border border-[#D5DEC9] text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-[#3E5239]" />
                    Cryptographic
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={() => {
                  playClickSound();
                  setIsSubmitModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] shadow-sm active:scale-[0.98] transition-transform font-medium text-xs flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Apply &amp; Submit Work</span>
              </button>

              <p className="text-[11px] text-[#525E50]/70 text-center mt-3 font-medium">
                Accepts GitHub PRs and Figma URLs
              </p>
            </div>

            {/* Posted By Founder Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525E50] mb-4">
                Posted By
              </h3>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] text-[#F4F6F1] font-bold text-sm flex items-center justify-center shrink-0 border border-[#3E5239]">
                  {posterName[0] || 'P'}
                </div>
                <div>
                  <h4 className="font-semibold text-[#1B241B] text-sm">
                    {posterName}
                  </h4>
                  <div className="text-xs text-[#3E5239] font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span>{company}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#525E50] leading-relaxed pt-3 border-t border-[#E4E8DE]">
                {task.poster?.bio || `Engineering Lead at ${company}. Discovering ambitious student builders via verifiable proof-of-work.`}
              </p>
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
