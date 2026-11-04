'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Award,
  Building,
  GraduationCap,
  Sparkles,
  Github,
  Figma,
  Link as LinkIcon,
  MessageSquare,
  Loader2,
  Plus,
  AlertCircle,
  FileText,
  ListTodo,
  TrendingUp,
  GitPullRequest,
} from 'lucide-react';
import PostTaskModal from '@/components/PostTaskModal';
import CodeInspectorDrawer from '@/components/CodeInspectorDrawer';
import { playBadgeMintSound, playClickSound } from '@/lib/sounds';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasksCount, setTasksCount] = useState<number>(4);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedSubForInspect, setSelectedSubForInspect] = useState<any | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [subsRes, tasksRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/tasks'),
      ]);

      const subsData = await subsRes.json();
      if (Array.isArray(subsData)) {
        setSubmissions(subsData);
      }

      const tasksData = await tasksRes.json();
      if (Array.isArray(tasksData)) {
        setTasksCount(tasksData.length);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateStatus = async (
    submissionId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    setActionLoading(submissionId);
    setActionMessage(null);

    try {
      const feedback = feedbackMap[submissionId] || '';
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, feedback }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update submission');
      }

      if (newStatus === 'approved') {
        // High-Impact Approval Action: Confetti burst & Harmonic mint chime
        playBadgeMintSound();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#6366f1', '#38bdf8', '#a855f7'],
          });
        } catch {
          // ignore
        }
      }

      setActionMessage(
        newStatus === 'approved'
          ? '🎉 Submission approved! Verified Skill Badge has been minted and issued to student portfolio.'
          : 'Submission updated as rejected with reviewer feedback.'
      );

      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Error updating submission');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-zinc-100">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2.5">
              <Building className="w-3.5 h-3.5" />
              <span>DevStudio Review Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Poster Review &amp; <span className="gradient-text">Badge Minting</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Audit student pull requests, inspect deliverables, and mint tamper-proof verified skill badges.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Task</span>
            </button>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-medium">{actionMessage}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-emerald-400 hover:text-emerald-200 text-xs font-bold ml-4 shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LIVE STATS BANNER: "Active Sprints", "Pending Submissions", "Issued Badges" */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Stat 1: Active Sprints */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Active Sprints
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {tasksCount}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 2: Pending Submissions */}
          <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/[0.03] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                Pending Submissions
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
                {pendingCount}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 3: Issued Badges */}
          <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/[0.03] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                Issued Badges
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
                {approvedCount}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-zinc-950 shadow-md font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            All Submissions ({submissions.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>Needs Review</span>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Approved &amp; Minted ({approvedCount})
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* SUBMISSION REVIEW DECK */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-zinc-400">Loading incoming submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="glass-card rounded-3xl border border-dashed border-white/10 p-12 text-center max-w-lg mx-auto">
            <FileText className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
            <h3 className="font-bold text-white text-lg mb-1">No Submissions Found</h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              {activeTab === 'pending'
                ? 'All pending student submissions have been reviewed and credentialed.'
                : 'Submissions made by students on micro-tasks will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((sub) => {
              const isGithub = sub.proofUrl?.includes('github.com');
              const isFigma = sub.proofUrl?.includes('figma.com');
              const isPending = sub.status === 'pending';
              const isApproved = sub.status === 'approved';
              const isRejected = sub.status === 'rejected';
              const studentName = sub.student?.name || sub.studentName || 'Alex Chen';
              const taskTitle = sub.task?.title || 'Micro-Task Deliverable';

              return (
                <div
                  key={sub._id}
                  className="glass-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl transition-all duration-300 hover:border-white/20"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Student info + Status pill */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-zinc-950 flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                            {studentName[0] || 'A'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-base">
                                {studentName}
                              </h3>
                              <Link
                                href={`/profile/${sub.student?._id || sub.studentId || 'student-1'}`}
                                className="text-xs font-semibold text-emerald-400 hover:underline"
                              >
                                View Portfolio &rarr;
                              </Link>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                              <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{sub.student?.college || 'Apex Tech Institute'}</span>
                              <span>•</span>
                              <span className="text-zinc-500 font-mono text-[11px]">
                                Submitted {new Date(sub.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              Pending Review
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved &amp; Minted
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Task Deliverable Link */}
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                          Task Deliverable:
                        </span>
                        <Link
                          href={`/tasks/${sub.taskId}`}
                          className="text-base font-bold text-white hover:text-indigo-300 transition"
                        >
                          {taskTitle}
                        </Link>
                      </div>

                      {/* Clickable Deliverable Link Box */}
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          {isGithub ? (
                            <Github className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : isFigma ? (
                            <Figma className="w-5 h-5 text-purple-400 shrink-0" />
                          ) : (
                            <LinkIcon className="w-5 h-5 text-zinc-400 shrink-0" />
                          )}
                          <span className="text-xs font-mono text-zinc-300 truncate">
                            {sub.proofUrl}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedSubForInspect(sub);
                              setIsInspectorOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition cursor-pointer shadow-sm"
                          >
                            <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Inspect Code Proof</span>
                          </button>

                          <a
                            href={sub.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 text-xs font-bold transition shrink-0 shadow-sm"
                          >
                            <span>Open URL</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Applicant Notes */}
                      {sub.notes && (
                        <div className="text-xs text-zinc-300 bg-black/30 p-3.5 rounded-xl border border-white/[0.06]">
                          <span className="font-semibold text-white block mb-1">
                            Applicant Notes:
                          </span>
                          <p className="leading-relaxed whitespace-pre-line text-zinc-300">
                            {sub.notes}
                          </p>
                        </div>
                      )}

                      {/* Poster Feedback */}
                      {sub.feedback && (
                        <div className="text-xs text-emerald-300 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20">
                          <span className="font-bold block mb-0.5">Poster Feedback:</span>
                          <p className="italic text-zinc-300">&ldquo;{sub.feedback}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    {/* Review Actions Column */}
                    <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-white/[0.08] lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 font-mono">
                          Review Action
                        </h4>

                        {isPending ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                                Feedback Note (optional):
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Excellent modular architecture!"
                                value={feedbackMap[sub._id] || ''}
                                onChange={(e) =>
                                  setFeedbackMap({
                                    ...feedbackMap,
                                    [sub._id]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {/* High-Impact Approval Button */}
                              <button
                                onClick={() => handleUpdateStatus(sub._id, 'approved')}
                                disabled={actionLoading === sub._id}
                                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === sub._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                                ) : (
                                  <Award className="w-4 h-4 text-zinc-950" />
                                )}
                                <span>Approve &amp; Issue Badge</span>
                              </button>

                              <button
                                onClick={() => handleUpdateStatus(sub._id, 'rejected')}
                                disabled={actionLoading === sub._id}
                                className="w-full py-2 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Reject Submission</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Approved / Rejected State Display */
                          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] text-center">
                            {isApproved ? (
                              <div className="text-emerald-300 space-y-1">
                                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                                <div className="font-bold text-xs uppercase tracking-wider font-mono">
                                  Verified Badge Issued
                                </div>
                                <p className="text-[11px] text-zinc-400">
                                  Credential is now live on the student&apos;s public profile.
                                </p>
                              </div>
                            ) : (
                              <div className="text-zinc-400 space-y-1">
                                <XCircle className="w-8 h-8 mx-auto text-rose-500 mb-1" />
                                <div className="font-bold text-xs uppercase tracking-wider text-rose-400 font-mono">
                                  Submission Rejected
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Post Task Modal */}
        <PostTaskModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onTaskCreated={() => {
            fetchDashboardData();
          }}
        />

        {/* Code Inspector Drawer */}
        <CodeInspectorDrawer
          isOpen={isInspectorOpen}
          onClose={() => {
            setIsInspectorOpen(false);
            setSelectedSubForInspect(null);
          }}
          submission={selectedSubForInspect}
          onApprove={async (subId) => {
            await handleUpdateStatus(subId, 'approved');
            setIsInspectorOpen(false);
            setSelectedSubForInspect(null);
          }}
          isActionLoading={actionLoading === selectedSubForInspect?._id}
        />
      </div>
    </div>
  );
}
