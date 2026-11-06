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
  Github,
  Figma,
  Link as LinkIcon,
  Loader2,
  Plus,
  FileText,
  ListTodo,
  TrendingUp,
  GitPullRequest,
  Terminal,
} from 'lucide-react';
import PostTaskModal from '@/components/PostTaskModal';
import CodeInspectorDrawer from '@/components/CodeInspectorDrawer';
import { playBadgeMintSound, playClickSound } from '@/lib/sounds';

export default function DashboardPage() {
  const { data: session } = useSession();
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

      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubmissions(Array.isArray(subsData) ? subsData : []);
      } else {
        setSubmissions([]);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasksCount(Array.isArray(tasksData) ? tasksData.length : 0);
      } else {
        setTasksCount(0);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setSubmissions([]);
      setTasksCount(0);
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
        playBadgeMintSound();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563EB', '#3B82F6', '#10B981', '#6366F1'],
          });
        } catch {
          // ignore
        }
      }

      setActionMessage(
        newStatus === 'approved'
          ? 'Deliverable verified. Verified Credential has been issued to the developer portfolio.'
          : 'Submission marked as rejected with reviewer feedback.'
      );

      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'Error updating submission');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSubmissions = (submissions ?? []).filter((s) => {
    if (!s) return false;
    if (activeTab === 'all') return true;
    return s.status === activeTab;
  });

  const pendingCount = (submissions ?? []).filter((s) => s?.status === 'pending').length;
  const approvedCount = (submissions ?? []).filter((s) => s?.status === 'approved').length;
  const rejectedCount = (submissions ?? []).filter((s) => s?.status === 'rejected').length;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBFBF9] text-[#1B241B] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2">
              <Terminal className="w-3.5 h-3.5 text-[#3E5239]" />
              <span>Review Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1B241B] tracking-tight">
              Company Review Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#525E50] mt-1">
              Audit pull requests, inspect live deliverables, and issue cryptographically verifiable credentials.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => {
                playClickSound();
                setIsPostModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] shadow-sm active:scale-[0.98] transition-transform font-medium text-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Challenge</span>
            </button>
          </div>
        </div>

        {/* Action Success Toast */}
        {actionMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#3E5239] shrink-0" />
              <span className="font-medium">{actionMessage}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-[#374B35] hover:text-[#1B241B] text-xs font-semibold ml-4 shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LIVE STATS BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Stat 1: Active Challenges */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#525E50] block mb-1">
                Active Challenges
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#1B241B]">
                {tasksCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EEF2EB] text-[#374B35] flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 2: Pending Submissions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#525E50] block mb-1">
                Pending Reviews
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#374B35]">
                {pendingCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EEF2EB] text-[#374B35] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Stat 3: Issued Badges */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#525E50] block mb-1">
                Issued Credentials
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#2D3B2D]">
                {approvedCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EEF2EB] text-[#2D3B2D] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E4E8DE] mb-6 pb-2 overflow-x-auto">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#344434] text-[#F4F6F1] shadow-sm'
                : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
            }`}
          >
            All Submissions ({submissions.length})
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('pending');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#EEF2EB] text-[#374B35] font-semibold border border-[#D5DEC9] shadow-sm'
                : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
            }`}
          >
            <span>Needs Review</span>
            <span className="bg-[#D5DEC9] text-[#2D3B2D] text-[11px] px-1.5 py-0.2 rounded-full font-semibold">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('approved');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-[#EEF2EB] text-[#2D3B2D] font-semibold border border-[#D5DEC9] shadow-sm'
                : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
            }`}
          >
            Approved ({approvedCount})
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('rejected');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-100 text-rose-900 font-semibold border border-rose-200 shadow-sm'
                : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE]'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* SUBMISSION REVIEW DECK */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#3E5239] mx-auto mb-3" />
            <p className="text-xs text-[#525E50] font-medium">Loading deliverables...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white/90 rounded-xl border border-dashed border-[#CCD5C3] p-12 text-center max-w-lg mx-auto shadow-sm">
            <FileText className="w-12 h-12 text-[#525E50]/60 mx-auto mb-3" />
            <h3 className="font-bold text-[#1B241B] text-base mb-1">No Submissions Found</h3>
            <p className="text-xs text-[#525E50] font-normal">
              {activeTab === 'pending'
                ? 'All pending deliverables have been reviewed and credentialed.'
                : 'Submissions made by engineers on project challenges will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(filteredSubmissions ?? []).map((sub) => {
              const isGithub = sub?.proofUrl?.includes('github.com');
              const isFigma = sub?.proofUrl?.includes('figma.com');
              const isPending = sub?.status === 'pending';
              const isApproved = sub?.status === 'approved';
              const isRejected = sub?.status === 'rejected';
              const studentName = sub?.student?.name ?? sub?.studentName ?? 'Anonymous Student';
              const taskTitle = sub?.task?.title ?? 'Project Challenge Deliverable';

              return (
                <div
                  key={sub._id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#E4E8DE] p-6 shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] transition-all hover:border-[#CCD5C3] hover:shadow-[0_4px_20px_rgba(40,50,40,0.08)] hover:-translate-y-0.5 duration-200 ease-out"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Student info + Status pill */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] text-[#F4F6F1] border border-[#3E5239] flex items-center justify-center font-bold text-base shrink-0">
                            {studentName[0] || 'A'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-[#1B241B] text-base">
                                {studentName}
                              </h3>
                              <Link
                                href={`/profile/${sub.student?._id || sub.studentId || 'student-1'}`}
                                className="text-xs font-medium text-[#3E5239] hover:text-[#2D3B2D] hover:underline"
                              >
                                Portfolio &rarr;
                              </Link>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-[#525E50]">
                              <GraduationCap className="w-3.5 h-3.5 text-[#525E50]" />
                              <span>{sub.student?.college || 'Apex Tech Institute'}</span>
                              <span>•</span>
                              <span className="text-[#525E50] text-xs">
                                Submitted {new Date(sub.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7]">
                              <Clock className="w-3.5 h-3.5 text-[#3E5239]" />
                              Pending
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5239]" />
                              Approved &amp; Credentialed
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Task Deliverable Link */}
                      <div>
                        <span className="text-xs font-medium text-[#525E50] block mb-1">
                          Project Challenge:
                        </span>
                        <Link
                          href={`/tasks/${sub.taskId}`}
                          className="text-base font-semibold text-[#1B241B] hover:text-[#3E5239] transition"
                        >
                          {taskTitle}
                        </Link>
                      </div>

                      {/* Clickable Deliverable Link Box */}
                      <div className="p-3.5 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7] shrink-0">
                            {isGithub ? (
                              <Github className="w-3.5 h-3.5 text-[#1B241B]" />
                            ) : isFigma ? (
                              <Figma className="w-3.5 h-3.5 text-purple-600" />
                            ) : (
                              <LinkIcon className="w-3.5 h-3.5 text-[#525E50]" />
                            )}
                            <span>PR Link</span>
                          </span>
                          <span className="text-xs text-[#525E50] truncate font-mono">
                            {sub.proofUrl}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              playClickSound();
                              setSelectedSubForInspect(sub);
                              setIsInspectorOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-medium transition cursor-pointer shadow-sm active:scale-[0.98]"
                          >
                            <GitPullRequest className="w-3.5 h-3.5 text-[#D5DEC9]" />
                            <span>Inspect Code Diff</span>
                          </button>

                          <a
                            href={sub.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4F6F1] text-[#1B241B] border border-[#D5DEC9] text-xs font-medium transition shrink-0 shadow-sm"
                          >
                            <span>Open URL</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#525E50]" />
                          </a>
                        </div>
                      </div>

                      {/* Applicant Notes */}
                      {sub.notes && (
                        <div className="text-xs text-[#525E50] bg-[#F8F9F5] p-3.5 rounded-xl border border-[#E4E8DE]">
                          <span className="font-semibold text-[#1B241B] block mb-1">
                            Applicant Notes:
                          </span>
                          <p className="leading-relaxed whitespace-pre-line text-[#525E50]">
                            {sub.notes}
                          </p>
                        </div>
                      )}

                      {/* Poster Feedback */}
                      {sub.feedback && (
                        <div className="text-xs text-[#1B241B] bg-[#EEF2EB]/60 p-3.5 rounded-xl border border-[#D5DEC9]">
                          <span className="font-semibold text-[#2D3B2D] block mb-0.5">Poster Feedback:</span>
                          <p className="italic text-emerald-800">&ldquo;{sub.feedback}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    {/* Review Actions Column */}
                    <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                          Review Action
                        </h4>

                        {isPending ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">
                                Feedback Note (Optional):
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Excellent architecture & test coverage!"
                                value={feedbackMap[sub._id] || ''}
                                onChange={(e) =>
                                  setFeedbackMap({
                                    ...feedbackMap,
                                    [sub._id]: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#E4E8DE] text-[#1B241B] placeholder:text-[#525E50]/60 focus:outline-none focus:ring-2 focus:ring-[#3E5239] focus:border-transparent transition"
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {/* Approval Button */}
                              <button
                                onClick={() => handleUpdateStatus(sub._id, 'approved')}
                                disabled={actionLoading === sub._id}
                                className="w-full py-2.5 px-4 rounded-lg bg-[#2D3B2D] hover:bg-[#1B241B] text-[#F4F6F1] font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === sub._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-[#D5DEC9]" />
                                ) : (
                                  <Award className="w-4 h-4 text-[#D5DEC9]" />
                                )}
                                <span>Approve &amp; Mint Credential</span>
                              </button>

                              <button
                                onClick={() => handleUpdateStatus(sub._id, 'rejected')}
                                disabled={actionLoading === sub._id}
                                className="w-full py-2 px-4 rounded-lg border border-[#E4E8DE] bg-white hover:bg-rose-50 text-rose-700 font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 text-rose-600" />
                                <span>Reject Deliverable</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Approved / Rejected State Display */
                          <div className="p-4 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] text-center">
                            {isApproved ? (
                              <div className="text-[#1B241B] space-y-1">
                                <CheckCircle2 className="w-8 h-8 mx-auto text-[#3E5239] mb-1" />
                                <div className="font-semibold text-xs text-[#1B241B]">
                                  Credential Issued
                                </div>
                                <p className="text-xs text-[#525E50] font-normal">
                                  Credential is live on developer profile.
                                </p>
                              </div>
                            ) : (
                              <div className="text-slate-900 space-y-1">
                                <XCircle className="w-8 h-8 mx-auto text-rose-600 mb-1" />
                                <div className="font-semibold text-xs text-rose-700">
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

        {/* DANGER ZONE: ACCOUNT DELETION */}

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
