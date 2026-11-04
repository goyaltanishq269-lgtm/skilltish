'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
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
} from 'lucide-react';
import PostTaskModal from '@/components/PostTaskModal';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

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

      setActionMessage(
        newStatus === 'approved'
          ? 'Submission approved and verified skill badge issued to student!'
          : 'Submission updated as rejected.'
      );

      await fetchSubmissions();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>DevStudio Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Poster Review & Badge Minting
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming student proof of work, verify GitHub/Figma deliverables, and issue badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Task</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Submissions
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {submissions.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
            Needs Review
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
            Badges Issued
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {approvedCount}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Rejected
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-600">
            {rejectedCount}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Pending Review</span>
          <span className="bg-amber-200/40 text-current text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {pendingCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Approved & Minted ({approvedCount})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading incoming submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No Submissions Found</h3>
          <p className="text-sm text-slate-500">
            {activeTab === 'pending'
              ? 'Great work! All incoming submissions have been reviewed.'
              : 'Submissions made by students on micro-tasks will show up here.'}
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

            return (
              <div
                key={sub._id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shadow-sm">
                          {sub.student?.name?.[0] || 'A'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              {sub.student?.name || 'Alex Chen'}
                            </h3>
                            <Link
                              href={`/profile/${sub.student?._id || sub.studentId || '660000000000000000000001'}`}
                              className="text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              View Portfolio &rarr;
                            </Link>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                            <span>{sub.student?.college || 'Apex Tech Institute'}</span>
                            <span>•</span>
                            <span className="text-slate-400">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved & Issued
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                            <XCircle className="w-3.5 h-3.5" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Task Deliverable:
                      </span>
                      <Link
                        href={`/tasks/${sub.taskId}`}
                        className="text-base font-bold text-slate-900 hover:text-indigo-600 transition"
                      >
                        {sub.task?.title || 'Micro-Task'}
                      </Link>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 truncate">
                        {isGithub ? (
                          <Github className="w-5 h-5 text-slate-900 shrink-0" />
                        ) : isFigma ? (
                          <Figma className="w-5 h-5 text-purple-600 shrink-0" />
                        ) : (
                          <LinkIcon className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {sub.proofUrl}
                        </span>
                      </div>
                      <a
                        href={sub.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition shrink-0 shadow-sm"
                      >
                        <span>Open Deliverable</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {sub.notes && (
                      <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-800 block mb-1">
                          Applicant Notes:
                        </span>
                        <p className="leading-relaxed whitespace-pre-line">{sub.notes}</p>
                      </div>
                    )}

                    {sub.feedback && (
                      <div className="text-xs text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                        <span className="font-semibold block mb-0.5">Poster Feedback:</span>
                        <p>&ldquo;{sub.feedback}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Review Action
                      </h4>

                      {isPending ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Feedback Note (optional):
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Excellent modular architecture!"
                              value={feedbackMap[sub._id] || ''}
                              onChange={(e) =>
                                setFeedbackMap({ ...feedbackMap, [sub._id]: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-1">
                            <button
                              onClick={() => handleUpdateStatus(sub._id, 'approved')}
                              disabled={actionLoading === sub._id}
                              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              {actionLoading === sub._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Award className="w-4 h-4" />
                              )}
                              <span>Approve & Issue Badge</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(sub._id, 'rejected')}
                              disabled={actionLoading === sub._id}
                              className="w-full py-2 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject Submission</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                          {isApproved ? (
                            <div className="text-emerald-700 space-y-1">
                              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
                              <div className="font-bold text-xs uppercase tracking-wider">
                                Verified Badge Issued
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Credential is now visible on student&apos;s public profile.
                              </p>
                            </div>
                          ) : (
                            <div className="text-slate-500 space-y-1">
                              <XCircle className="w-8 h-8 mx-auto text-rose-500 mb-1" />
                              <div className="font-bold text-xs uppercase tracking-wider text-rose-600">
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

      <PostTaskModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onTaskCreated={() => {
          fetchSubmissions();
        }}
      />
    </div>
  );
}
