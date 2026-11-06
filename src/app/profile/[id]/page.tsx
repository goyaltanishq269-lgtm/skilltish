'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import confetti from 'canvas-confetti';
import BadgeCard from '@/components/BadgeCard';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import PostTaskModal from '@/components/PostTaskModal';
import CodeInspectorDrawer from '@/components/CodeInspectorDrawer';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  ExternalLink,
  Github,
  Linkedin,
  Figma,
  Link as LinkIcon,
  CheckCircle2,
  Calendar,
  Share2,
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
  Building2,
  Briefcase,
  Mail,
  X,
  Send,
  Check,
  Copy,
  AlertTriangle,
  Trash2,
  Layers,
  Lock,
  Database,
  Terminal,
  Plus,
  Users,
  Inbox,
  GitPullRequest,
  CheckCheck,
  FileCode,
} from 'lucide-react';
import { playClickSound, playBadgeMintSound } from '@/lib/sounds';

export default function StudentProfilePage() {
  // =========================================================================
  // 1. Next.js & NextAuth Hooks (Unconditionally at absolute top)
  // =========================================================================
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  // =========================================================================
  // 2. React State Hooks
  // =========================================================================
  const [activeTab, setActiveTab] = useState<'tasks' | 'requests'>('tasks');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedStudentEmail, setCopiedStudentEmail] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Collections
  const [tasks, setTasks] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Review Drawer state
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // =========================================================================
  // 3. React Callback Hooks
  // =========================================================================
  const isFounderId =
    id === 'founder' ||
    id === 'creator' ||
    id === 'tanishq' ||
    id === 'tanishq-goyal';

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else if (isFounderId) {
        setData({
          user: {
            _id: 'founder',
            id: 'founder',
            name: 'Tanishq Goyal',
            email: 'goyaltanishq269@gmail.com',
            role: 'owner',
            company: 'SkillTish Architecture',
            bio: 'Architected SkillTish as a verifiable proof-of-work protocol to replace credential inflation with tamper-proof engineering provenance.',
            college: 'B.Tech Computer Science & Engineering',
            skills: [
              'Next.js 14 App Router',
              'TypeScript',
              'Tailwind CSS',
              'NextAuth JWT',
              'MongoDB Atlas',
              'SHA-256 Proof Engine',
            ],
          },
          badges: [],
          completedTasks: [],
        });
      } else {
        // Fallback for authenticated session user viewing their own profile
        const sessionEmail = session?.user?.email?.trim().toLowerCase();
        const sessionId = String(
          session?.user?.id || (session?.user as any)?._id || ''
        ).trim();
        const pageId = String(id || '').trim();
        const decodedPageId = decodeURIComponent(pageId).toLowerCase();

        const isSelf = Boolean(
          session?.user && (
            (sessionId && sessionId === pageId) ||
            (sessionEmail && (sessionEmail === pageId.toLowerCase() || sessionEmail === decodedPageId))
          )
        );

        if (isSelf && session?.user) {
          setData({
            user: {
              _id: sessionId || pageId,
              id: sessionId || pageId,
              name: session.user.name || 'Engineer',
              email: session.user.email,
              role: session.user.role || 'student',
              college: (session.user as any)?.college || 'Apex Tech Institute',
              company: (session.user as any)?.company || 'Stealth Startup',
              bio: (session.user as any)?.bio || '',
              skills: (session.user as any)?.skills || ['TypeScript', 'Next.js', 'React'],
            },
            badges: [],
            completedTasks: [],
          });
        } else {
          throw new Error('Profile not found in ledger');
        }
      }
    } catch (err: any) {
      if (isFounderId) {
        setData({
          user: {
            _id: 'founder',
            id: 'founder',
            name: 'Tanishq Goyal',
            email: 'goyaltanishq269@gmail.com',
            role: 'owner',
            company: 'SkillTish Architecture',
            bio: 'Architected SkillTish as a verifiable proof-of-work protocol to replace credential inflation with tamper-proof engineering provenance.',
            college: 'B.Tech Computer Science & Engineering',
            skills: [
              'Next.js 14 App Router',
              'TypeScript',
              'Tailwind CSS',
              'NextAuth JWT',
              'MongoDB Atlas',
              'SHA-256 Proof Engine',
            ],
          },
          badges: [],
          completedTasks: [],
        });
      } else {
        const sessionEmail = session?.user?.email?.trim().toLowerCase();
        const sessionId = String(
          session?.user?.id || (session?.user as any)?._id || ''
        ).trim();
        const pageId = String(id || '').trim();
        const decodedPageId = decodeURIComponent(pageId).toLowerCase();

        const isSelf = Boolean(
          session?.user && (
            (sessionId && sessionId === pageId) ||
            (sessionEmail && (sessionEmail === pageId.toLowerCase() || sessionEmail === decodedPageId))
          )
        );

        if (isSelf && session?.user) {
          setData({
            user: {
              _id: sessionId || pageId,
              id: sessionId || pageId,
              name: session.user.name || 'Engineer',
              email: session.user.email,
              role: session.user.role || 'student',
              college: (session.user as any)?.college || 'Apex Tech Institute',
              company: (session.user as any)?.company || 'Stealth Startup',
              bio: (session.user as any)?.bio || '',
              skills: (session.user as any)?.skills || ['TypeScript', 'Next.js', 'React'],
            },
            badges: [],
            completedTasks: [],
          });
          setError(null);
        } else {
          setError(err.message || 'Error loading profile');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [id, isFounderId, session]);

  const fetchTasksAndSubmissions = useCallback(async () => {
    setTasksLoading(true);
    try {
      const [tasksRes, subsRes] = await Promise.all([
        fetch('/api/tasks?status=all'),
        fetch('/api/submissions'),
      ]);
      if (tasksRes.ok) {
        const allTasks = await tasksRes.json();
        setTasks(Array.isArray(allTasks) ? allTasks : []);
      }
      if (subsRes.ok) {
        const allSubs = await subsRes.json();
        setSubmissions(Array.isArray(allSubs) ? allSubs : []);
      }
    } catch (err) {
      console.warn('Failed to load tasks/submissions:', err);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const handleApproveSubmission = useCallback(
    async (submissionId: string) => {
      setActionLoadingId(submissionId);
      setActionSuccessMessage(null);
      try {
        const res = await fetch(`/api/submissions/${submissionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'approved',
            feedback: 'Verified deliverable. Cryptographic credential minted.',
          }),
        });

        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || 'Failed to approve submission');
        }

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

        setActionSuccessMessage(
          'Deliverable verified and cryptographic credential minted successfully.'
        );
        setIsInspectorOpen(false);
        await fetchTasksAndSubmissions();
      } catch (err: any) {
        alert(err.message || 'Error approving submission');
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchTasksAndSubmissions]
  );

  // =========================================================================
  // 4. React Effect Hooks
  // =========================================================================
  useEffect(() => {
    fetchProfile();
    fetchTasksAndSubmissions();
  }, [fetchProfile, fetchTasksAndSubmissions]);

  useEffect(() => {
    const handleTaskCreated = () => {
      fetchTasksAndSubmissions();
    };
    window.addEventListener('task-created', handleTaskCreated);
    return () => window.removeEventListener('task-created', handleTaskCreated);
  }, [fetchTasksAndSubmissions]);

  // =========================================================================
  // 5. Unconditionally Declared useMemo Hooks (Strict Rule of Hooks Compliance)
  // =========================================================================
  const profileUser = useMemo(() => {
    if (data?.user) return data.user;

    // Fallback: If authenticated session user is viewing their own profile page, fallback to session.user
    const currentSessionEmail = session?.user?.email?.trim().toLowerCase();
    const currentSessionId = String(
      session?.user?.id || (session?.user as any)?._id || ''
    ).trim();
    const pageId = String(id || '').trim();
    const decodedPageId = decodeURIComponent(pageId).toLowerCase();

    if (
      session?.user &&
      ((currentSessionId && currentSessionId === pageId) ||
       (currentSessionEmail && (currentSessionEmail === pageId.toLowerCase() || currentSessionEmail === decodedPageId)))
    ) {
      return {
        _id: currentSessionId || pageId,
        id: currentSessionId || pageId,
        name: session.user.name || 'Engineer',
        email: session.user.email,
        role: session.user.role || 'student',
        college: (session.user as any)?.college || 'Apex Tech Institute',
        company: (session.user as any)?.company || 'Stealth Startup',
        bio: (session.user as any)?.bio || '',
        skills: (session.user as any)?.skills || ['TypeScript', 'Next.js', 'React'],
      };
    }
    return null;
  }, [data, session, id]);

  const badges = useMemo(() => {
    return data?.badges ?? [];
  }, [data]);

  const completedTasks = useMemo(() => {
    return data?.completedTasks ?? [];
  }, [data]);

  const isOwner = useMemo(() => {
    if (!session?.user) return false;

    const currentSessionEmail = session.user.email?.trim().toLowerCase();
    const profileEmail = profileUser?.email?.trim().toLowerCase();
    const currentSessionId = String(
      session.user.id || (session.user as any)?._id || ''
    ).trim();
    const profileUserId = String(
      profileUser?.id || profileUser?._id || ''
    ).trim();
    const pageId = String(id || '').trim();
    const decodedPageId = decodeURIComponent(pageId).toLowerCase();

    // User owns this profile if:
    // 1. Session email matches the profile email, OR
    // 2. Session ID matches profile ID, OR
    // 3. Session email matches the page ID (if email used as slug), OR
    // 4. Session ID matches the page ID directly
    return Boolean(
      (currentSessionEmail && profileEmail && currentSessionEmail === profileEmail) ||
      (currentSessionId && profileUserId && currentSessionId === profileUserId) ||
      (currentSessionId && pageId && currentSessionId === pageId) ||
      (currentSessionEmail && pageId && (currentSessionEmail === pageId.toLowerCase() || currentSessionEmail === decodedPageId))
    );
  }, [session, profileUser, id]);

  // Ensure strict string comparison and fallback
  const userRole = (profileUser?.role || 'student').toLowerCase();
  const isCompany =
    userRole === 'company' ||
    userRole === 'owner' ||
    userRole === 'founder' ||
    userRole === 'poster';
  const isStudent = userRole === 'student' && !isCompany;

  const authoredTasks = useMemo(() => {
    if (!profileUser) return [];
    const targetId = profileUser._id?.toString?.() || profileUser.id || id;
    const targetEmail = profileUser.email?.toLowerCase?.();

    return (tasks ?? []).filter((task: any) => {
      const creatorId =
        task?.creatorId?.toString?.() ||
        task?.creatorId ||
        task?.posterId?.toString?.() ||
        task?.posterId ||
        task?.poster?._id?.toString?.();
      const creatorEmail = (
        task?.creatorEmail ||
        task?.creator?.email ||
        task?.poster?.email ||
        task?.posterEmail ||
        ''
      )?.toLowerCase?.();

      const matchesId = Boolean(
        targetId && creatorId && String(creatorId) === String(targetId)
      );
      const matchesEmail = Boolean(
        targetEmail && creatorEmail && creatorEmail === targetEmail
      );

      const isFounderProfile =
        profileUser.role === 'founder' ||
        ['founder', 'creator', 'tanishq', 'tanishq-goyal'].includes(id);

      const matchesFounder = Boolean(
        isFounderProfile &&
          (['founder', 'creator', 'tanishq', 'tanishq-goyal'].includes(
            String(creatorId)
          ) ||
            creatorEmail === 'goyaltanishq269@gmail.com')
      );

      return matchesId || matchesEmail || matchesFounder;
    });
  }, [tasks, profileUser, id]);

  const incomingRequests = useMemo(() => {
    if (!profileUser) return [];
    const myTaskIds = new Set(
      authoredTasks.map((t: any) =>
        String(t._id?.toString?.() || t.id?.toString?.() || t._id || t.id)
      )
    );
    return (submissions ?? []).filter((sub: any) => {
      const subTaskId = String(
        sub?.taskId?._id?.toString?.() ||
          sub?.taskId?.toString?.() ||
          sub?.taskId
      );
      return myTaskIds.has(subTaskId);
    });
  }, [authoredTasks, submissions, profileUser]);

  // =========================================================================
  // 6. Helper Functions & UI Handlers (Non-Hook)
  // =========================================================================
  const copyShareLink = () => {
    playClickSound();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTaskDifficulty = (
    task: any
  ): { label: 'Beginner' | 'Intermediate' | 'Advanced'; color: string } => {
    const raw = String(task.difficulty || '').toLowerCase();
    if (raw.includes('beg')) {
      return {
        label: 'Beginner',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      };
    }
    if (raw.includes('adv')) {
      return {
        label: 'Advanced',
        color: 'bg-purple-50 text-purple-700 border-purple-200/80',
      };
    }
    if (raw.includes('inter')) {
      return {
        label: 'Intermediate',
        color: 'bg-[#EEF2EB] text-[#374B35] border-[#D5DEC9]',
      };
    }

    if (task.duration === '1 day') {
      return {
        label: 'Beginner',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      };
    }
    if (task.duration === '1 week' || task.duration === '2 weeks') {
      return {
        label: 'Advanced',
        color: 'bg-[#F2F4EE] text-[#1B241B] border-[#DEE3D7]',
      };
    }
    return {
      label: 'Intermediate',
      color: 'bg-[#EEF2EB] text-[#374B35] border-[#D5DEC9]',
    };
  };

  const getSubmissionCount = (taskId: string) => {
    if (!taskId) return 0;
    return (submissions ?? []).filter(
      (s: any) =>
        String(s.taskId?._id || s.taskId) === String(taskId)
    ).length;
  };

  // =========================================================================
  // 7. Conditional Early Returns (Guaranteed downstream of all hooks)
  // =========================================================================
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBF9] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#3E5239] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#525E50]">Loading verified portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !profileUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBF9] flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-[#E4E8DE] shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1B241B] mb-2">Profile Not Found</h2>
          <p className="text-xs sm:text-sm text-[#525E50] mb-6 font-normal">
            Could not locate a verified developer or company record with this identifier in the ledger.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition"
          >
            <span>Explore Challenges</span>
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. Main Render
  // =========================================================================
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBFBF9] text-[#1B241B] font-sans">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Dynamic Context Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[#525E50]">
          <span className="text-[#3E5239] font-semibold">
            {isCompany
              ? userRole === 'founder' || userRole === 'owner'
                ? 'Platform Architect & Founder'
                : 'Company / Organization Workspace'
              : 'Developer Portfolio'}
          </span>
          <span>•</span>
          <span>
            {isCompany
              ? 'Published Challenges & Review Queue'
              : 'Verified Engineering Ledger'}
          </span>
        </div>

        {isCompany ? (
          /* =========================================================================
             VIEW A: COMPANY / OWNER PROFILE (NO STUDENT BADGES)
             ========================================================================= */
          <div className="space-y-8 mb-14">
            {/* 1. COMPANY / OWNER HEADER */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E4E8DE] p-6 sm:p-9 shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#2D3B2D] text-[#F4F6F1] font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0 border border-[#3E5239]">
                    <Building2 className="w-10 h-10 text-[#D5DEC9]" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3E5239]" />
                        <span>
                          {profileUser.role === 'founder'
                            ? 'Platform Architect & Founder'
                            : 'Verified Organization'}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7] font-mono">
                        Challenge Partner
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B241B] tracking-tight">
                      {profileUser.company || profileUser.name || 'Verified Organization'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#525E50] font-medium">
                      <span className="flex items-center gap-1 text-[#1B241B] font-semibold">
                        <Building2 className="w-3.5 h-3.5 text-[#3E5239]" />
                        <span>{profileUser.industry || 'B2B SaaS / Developer Infrastructure'}</span>
                      </span>
                      <span>•</span>
                      <span>{profileUser.location || 'San Francisco, CA'}</span>
                      <span>•</span>
                      <span className="font-mono text-[#525E50]">{profileUser.email}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#525E50] max-w-2xl leading-relaxed font-normal pt-1">
                      {profileUser.bio ||
                        'Verified enterprise hiring partner and project publisher on SkillTish. We publish production-grade engineering challenges to evaluate and hire verified technical talent.'}
                    </p>
                  </div>
                </div>

                {/* Right Action Group */}
                <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2.5 shrink-0 self-start md:self-auto pt-2 md:pt-0">
                  {/* + Add New Task CTA (Only if owner) */}
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setIsPostModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Task / Post Challenge</span>
                    </button>
                  )}

                  {/* Share Profile button */}
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-semibold shadow-sm transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-[#525E50]" />
                        <span>Share Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Metrics Summary Strip */}
              <div className="mt-6 pt-6 border-t border-[#E4E8DE] flex flex-wrap items-center gap-6 text-xs text-[#525E50]">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-[#1B241B]">
                    {authoredTasks.length}
                  </span>
                  <span className="font-medium text-[#525E50]">Challenges Published</span>
                </div>
                <div className="h-4 w-px bg-[#E3E6DC]" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-[#374B35]">
                    {incomingRequests.length}
                  </span>
                  <span className="font-medium text-[#525E50]">Submissions Received</span>
                </div>
                <div className="h-4 w-px bg-[#E3E6DC]" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-[#2D3B2D]">
                    {incomingRequests.filter((r: any) => r.status === 'approved').length}
                  </span>
                  <span className="font-medium text-[#525E50]">Credentials Minted</span>
                </div>
              </div>
            </div>

            {/* Success toast notification */}
            {actionSuccessMessage && (
              <div className="p-4 rounded-xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0" />
                  <span className="font-medium">{actionSuccessMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActionSuccessMessage(null)}
                  className="text-[#374B35] hover:text-[#1B241B] p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 2. OWNER MANAGEMENT WORKSPACE (TABS) */}
            <div>
              {/* Tab Selector */}
              <div className="flex items-center gap-2 border-b border-[#E4E8DE] pb-px mb-6">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab('tasks');
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px cursor-pointer ${
                    activeTab === 'tasks'
                      ? 'border-[#3E5239] text-[#2D3B2D]'
                      : 'border-transparent text-[#525E50] hover:text-[#1B241B] hover:border-[#D5DEC9]'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Tasks &amp; Projects Posted</span>
                  <span
                    className={`ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      activeTab === 'tasks'
                        ? 'bg-[#EEF2EB] text-[#374B35]'
                        : 'bg-[#F2F4EE] text-[#525E50]'
                    }`}
                  >
                    {authoredTasks.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveTab('requests');
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition -mb-px cursor-pointer ${
                    activeTab === 'requests'
                      ? 'border-[#3E5239] text-[#2D3B2D]'
                      : 'border-transparent text-[#525E50] hover:text-[#1B241B] hover:border-[#D5DEC9]'
                  }`}
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Incoming Requests &amp; Submissions</span>
                  <span
                    className={`ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      activeTab === 'requests'
                        ? 'bg-[#EEF2EB] text-[#374B35]'
                        : 'bg-[#F2F4EE] text-[#525E50]'
                    }`}
                  >
                    {incomingRequests.length}
                  </span>
                </button>
              </div>

              {/* SECTION 1: TASKS & PROJECTS POSTED */}
              {activeTab === 'tasks' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1B241B] tracking-tight">
                        Assigned Tasks &amp; Projects Posted
                      </h2>
                      <p className="text-xs text-[#525E50] mt-0.5">
                        Active challenges published by this organization for candidate proof-of-work evaluation.
                      </p>
                    </div>

                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setIsPostModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Post Challenge</span>
                      </button>
                    )}
                  </div>

                  {tasksLoading && authoredTasks.length === 0 ? (
                    <div className="bg-white/90 rounded-2xl border border-[#E4E8DE] p-8 text-center shadow-sm">
                      <Loader2 className="w-6 h-6 animate-spin text-[#3E5239] mx-auto mb-2" />
                      <p className="text-xs font-medium text-[#525E50]">Loading published challenges...</p>
                    </div>
                  ) : authoredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {(authoredTasks ?? []).map((task: any) => {
                        const diff = getTaskDifficulty(task);
                        const taskId = task._id || task.id;
                        const subCount = getSubmissionCount(taskId);

                        return (
                          <div
                            key={taskId}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E4E8DE] p-6 shadow-sm hover:border-[#CCD5C3] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span
                                  className={`font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${diff.color}`}
                                >
                                  {diff.label}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7]">
                                    {task.status || 'Active'}
                                  </span>
                                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                                    <Sparkles className="w-3 h-3 text-[#3E5239]" />
                                    <span>{task.stipendOrPerks || task.reward || '$500'}</span>
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-base font-bold text-[#1B241B] tracking-tight mb-2 line-clamp-2">
                                {task.title}
                              </h3>

                              {task.description && (
                                <p className="text-xs text-[#525E50] line-clamp-2 leading-relaxed mb-4 font-normal">
                                  {task.description}
                                </p>
                              )}

                              {Array.isArray(task.skillsRequired) && task.skillsRequired.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                  {(task?.skillsRequired ?? []).slice(0, 3).map((skill: string) => (
                                    <span
                                      key={skill}
                                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7]"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {task.skillsRequired.length > 3 && (
                                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#F2F4EE] text-[#525E50]">
                                      +{task.skillsRequired.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-[#E4E8DE] flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#F8F9F5] text-[#525E50] border border-[#E4E8DE]">
                                <Users className="w-3.5 h-3.5 text-[#525E50]" />
                                <span>
                                  {subCount} {subCount === 1 ? 'Submission' : 'Submissions'}
                                </span>
                              </span>

                              <Link
                                href={`/tasks/${taskId}`}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E5239] hover:text-[#2D3B2D] transition group"
                              >
                                <span>Inspect Challenge</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty state */
                    <div className="bg-white/90 rounded-2xl border border-dashed border-[#CCD5C3] p-10 text-center max-w-lg mx-auto shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEF2EB] text-[#374B35] flex items-center justify-center mx-auto mb-3 border border-[#D5DEC9]">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#1B241B] mb-1">
                        No challenges published yet.
                      </h4>
                      <p className="text-xs text-[#525E50] max-w-md mx-auto mb-5 font-normal">
                        Click &apos;+ Add New Task&apos; to post your first engineering task and start receiving candidate pull requests.
                      </p>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setIsPostModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add New Task / Post Challenge</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: INCOMING REQUESTS & SUBMISSIONS QUEUE */}
              {activeTab === 'requests' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1B241B] tracking-tight">
                      Incoming Requests &amp; Submissions Queue
                    </h2>
                    <p className="text-xs text-[#525E50] mt-0.5">
                      Review incoming pull requests and deliverables submitted by candidate engineers for your challenges.
                    </p>
                  </div>

                  {incomingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {(incomingRequests ?? []).map((sub: any) => {
                        const subId = sub._id || sub.id;
                        const candidateName = sub.student?.name || sub.studentName || 'Candidate';
                        const candidateCollege = sub.student?.college || 'Apex Tech Institute';
                        const candidateEmail = sub.student?.email;
                        const taskTitle =
                          sub.task?.title ||
                          (authoredTasks ?? []).find(
                            (t: any) => String(t._id || t.id) === String(sub.taskId)
                          )?.title ||
                          'Engineering Challenge';
                        const isApproved = sub.status === 'approved';
                        const isRejected = sub.status === 'rejected';
                        const isPending = !isApproved && !isRejected;

                        return (
                          <div
                            key={subId}
                            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E4E8DE] p-5 sm:p-6 shadow-sm hover:border-[#CCD5C3] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-2 min-w-0 flex-1">
                              {/* Status and target task pill */}
                              <div className="flex flex-wrap items-center gap-2">
                                {isApproved ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                                    <CheckCircle2 className="w-3 h-3 text-[#3E5239]" />
                                    <span>Approved &amp; Minted</span>
                                  </span>
                                ) : isRejected ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                    <X className="w-3 h-3 text-rose-600" />
                                    <span>Rejected</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7]">
                                    <Clock className="w-3 h-3 text-[#3E5239]" />
                                    <span>Under Review</span>
                                  </span>
                                )}

                                <span className="text-xs font-semibold text-[#525E50] truncate max-w-xs">
                                  Task: <strong className="text-[#1B241B]">{taskTitle}</strong>
                                </span>

                                {sub.createdAt && (
                                  <span className="text-[11px] text-[#525E50] font-mono">
                                    {new Date(sub.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                )}
                              </div>

                              {/* Candidate Info */}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#525E50]">
                                <span className="font-semibold text-[#1B241B]">{candidateName}</span>
                                <span>•</span>
                                <span>{candidateCollege}</span>
                                {candidateEmail && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono text-[#525E50]">{candidateEmail}</span>
                                  </>
                                )}
                              </div>

                              {/* PR Link */}
                              {sub.proofUrl && (
                                <div className="flex items-center gap-2 pt-0.5">
                                  <a
                                    href={sub.proofUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3E5239] hover:text-[#2D3B2D] hover:underline"
                                  >
                                    <Github className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-xs sm:max-w-md">{sub.proofUrl}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}

                              {/* Notes */}
                              {sub.notes && (
                                <p className="text-xs text-[#525E50] line-clamp-1 italic bg-[#F8F9F5] p-2 rounded-lg border border-[#E4E8DE]">
                                  &ldquo;{sub.notes}&rdquo;
                                </p>
                              )}
                            </div>

                            {/* Actions Group */}
                            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                              {/* Inspect Code button */}
                              <button
                                type="button"
                                onClick={() => {
                                  playClickSound();
                                  setSelectedSubmission(sub);
                                  setIsInspectorOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-semibold shadow-sm transition cursor-pointer"
                              >
                                <FileCode className="w-3.5 h-3.5 text-[#525E50]" />
                                <span>Inspect Code</span>
                              </button>

                              {/* Direct Approve & Mint Proof button */}
                              {isPending && isOwner && (
                                <button
                                  type="button"
                                  disabled={actionLoadingId === subId}
                                  onClick={() => handleApproveSubmission(subId)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D3B2D] hover:bg-[#1B241B] text-[#F4F6F1] text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                                >
                                  {actionLoadingId === subId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCheck className="w-3.5 h-3.5" />
                                  )}
                                  <span>Approve &amp; Mint Proof</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="bg-white/90 rounded-2xl border border-dashed border-[#CCD5C3] p-10 text-center max-w-lg mx-auto shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-[#EEF2EB] text-[#374B35] flex items-center justify-center mx-auto mb-3 border border-[#D5DEC9]">
                        <Inbox className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#1B241B] mb-1">
                        No incoming student submissions yet.
                      </h4>
                      <p className="text-xs text-[#525E50] max-w-md mx-auto font-normal">
                        Published challenges will receive candidate pull requests and verified proof deliverables here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
             VIEW B: STUDENT PROFILE (CANDIDATE VIEW)
             ========================================================================= */
          <>
            {/* PROFILE IDENTITY CARD (HEADER) */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E4E8DE] p-6 sm:p-8 shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] mb-12 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#2D3B2D] text-[#F4F6F1] font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-sm shrink-0 border border-[#3E5239]">
                    <span>{profileUser.name?.[0] || 'A'}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B241B] tracking-tight">
                        {profileUser.name || 'Developer'}
                      </h1>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3E5239]" />
                        Verified Engineer
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-[#525E50] mb-3">
                      <span className="flex items-center gap-1.5 font-medium text-[#1B241B]">
                        <GraduationCap className="w-4 h-4 text-[#3E5239] shrink-0" />
                        <span>{profileUser.college || 'Apex Tech Institute'}</span>
                      </span>
                      <span className="text-[#D5DEC9]">•</span>
                      <span className="text-[#525E50] font-mono text-xs">{profileUser.email}</span>
                    </div>

                    {profileUser.bio && (
                      <p className="text-xs sm:text-sm text-[#525E50] max-w-2xl leading-relaxed font-normal mb-3">
                        {profileUser.bio}
                      </p>
                    )}

                    {/* Direct Social & Connect Pills (Student's own credentials only - zero leak) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {profileUser.github && (
                        <a
                          href={profileUser.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4F6F1] border border-[#D5DEC9] text-[#1B241B] text-xs font-medium transition shadow-sm"
                          title="View GitHub Profile"
                        >
                          <Github className="w-3.5 h-3.5 text-[#1B241B]" />
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3 text-[#525E50]" />
                        </a>
                      )}

                      {profileUser.linkedin && (
                        <a
                          href={profileUser.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF2EB] hover:bg-[#D5DEC9] border border-[#D5DEC9] text-[#374B35] text-xs font-medium transition shadow-sm"
                          title="View LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5 text-[#3E5239]" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 text-[#3E5239]" />
                        </a>
                      )}

                      {profileUser.email && (
                        <div className="inline-flex items-center rounded-lg bg-white border border-[#D5DEC9] text-xs shadow-sm overflow-hidden">
                          <a
                            href={`mailto:${profileUser.email}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#1B241B] hover:text-[#2D3B2D] font-medium"
                            title={`Email ${profileUser.email}`}
                          >
                            <Mail className="w-3.5 h-3.5 text-[#3E5239]" />
                            <span>Email</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              navigator.clipboard.writeText(profileUser.email);
                              setCopiedStudentEmail(true);
                              setTimeout(() => setCopiedStudentEmail(false), 2000);
                            }}
                            className="px-2 py-1.5 border-l border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#525E50] hover:text-[#1B241B] transition cursor-pointer"
                            title="Copy email address"
                          >
                            {copiedStudentEmail ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-[#525E50]" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3.5 shrink-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Connect / Contact Developer Button */}
                    {!isOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setIsHireModalOpen(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                      >
                        <Briefcase className="w-4 h-4 text-[#D5DEC9]" />
                        <span>Contact Developer</span>
                      </button>
                    )}

                    {/* Primary "Share Public Portfolio" button */}
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-[#525E50]" />
                          <span>Share Portfolio</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-[#525E50] pt-1">
                    <div className="text-center">
                      <span className="block text-xl font-extrabold text-[#374B35] font-mono">
                        {badges.length}
                      </span>
                      <span>Verified Credentials</span>
                    </div>
                    <div className="h-6 w-px bg-[#E3E6DC]" />
                    <div className="text-center">
                      <span className="block text-xl font-extrabold text-[#1B241B] font-mono">
                        {completedTasks.length}
                      </span>
                      <span>Challenges Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {Array.isArray(profileUser.skills) && profileUser.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#E4E8DE] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-[#525E50] mr-1">
                    Verified Core Stack:
                  </span>
                  {(profileUser.skills ?? []).map((skill: string) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#F2F4EE] text-[#414E3F] border border-[#DEE3D7]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* VERIFIED SKILL BADGES SECTION */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2">
                    <Award className="w-3.5 h-3.5 text-[#3E5239]" />
                    <span>Cryptographically Verifiable</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B241B] tracking-tight">
                    Verified Skill Credentials
                  </h2>
                  <p className="text-xs sm:text-sm text-[#525E50] mt-1">
                    Earned through direct code inspections and startup founder approvals.
                  </p>
                </div>
              </div>

              {badges.length === 0 ? (
                <div className="bg-white/90 rounded-2xl border border-dashed border-[#CCD5C3] p-10 text-center max-w-md mx-auto shadow-sm">
                  <Award className="w-10 h-10 text-[#525E50]/60 mx-auto mb-2.5" />
                  <h4 className="text-sm font-bold text-[#1B241B]">No Credentials Issued Yet</h4>
                  <p className="text-xs text-[#525E50] mt-1 mb-5">
                    Apply to project challenges in the backlog to earn verified credentials.
                  </p>
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition"
                  >
                    <span>Explore Challenges to Earn Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(badges ?? []).map((badge: any) => (
                    <BadgeCard key={badge._id || badge.id} badge={badge} />
                  ))}
                </div>
              )}
            </div>

            {/* PROOF-OF-WORK DELIVERABLES SECTION */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3E5239]" />
                    <span>Production Deliverables</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B241B] tracking-tight">
                    Verified Proof of Work
                  </h2>
                  <p className="text-xs sm:text-sm text-[#525E50] mt-1">
                    Audited code repositories, pull requests, and verified deliverables.
                  </p>
                </div>
              </div>

              {completedTasks.length === 0 ? (
                <div className="bg-white/90 rounded-2xl border border-dashed border-[#CCD5C3] p-10 text-center max-w-md mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-[#525E50]/60 mx-auto mb-2.5" />
                  <h4 className="text-sm font-bold text-[#1B241B]">No Approved Deliverables Yet</h4>
                  <p className="text-xs text-[#525E50] mt-1 mb-5">
                    Approved pull requests and designs will be showcased here with direct links.
                  </p>
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition"
                  >
                    <span>Explore Challenges to Earn Proof</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {(completedTasks ?? []).map((sub: any) => {
                    const isGithub = sub.proofUrl?.includes('github.com');
                    const isFigma = sub.proofUrl?.includes('figma.com');
                    const companyName =
                      sub.task?.companyName || sub.task?.poster?.company || 'DevStudio';
                    const approvedDate = sub.reviewedAt || sub.updatedAt || sub.createdAt;
                    const formattedApprovedDate = approvedDate
                      ? new Date(approvedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Verified';

                    return (
                      <div
                        key={sub._id || sub.id}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E4E8DE] p-6 sm:p-7 shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] hover:border-[#CCD5C3] hover:shadow-[0_4px_20px_rgba(40,50,40,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-out"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#3E5239]" />
                                Approved &amp; Audited
                              </span>

                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2F4EE] text-[#414E3F] text-xs font-semibold border border-[#DEE3D7]">
                                <Building2 className="w-3.5 h-3.5 text-[#3E5239]" />
                                {companyName}
                              </span>

                              <span className="text-xs text-[#525E50] flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3 text-[#525E50]" />
                                Approved {formattedApprovedDate}
                              </span>

                              {sub.task?.duration && (
                                <span className="text-xs text-[#525E50] flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3 text-[#525E50]" />
                                  {sub.task.duration} Challenge
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-semibold text-[#1B241B] tracking-tight">
                              {sub.task?.title || 'Completed Project Challenge'}
                            </h3>
                          </div>

                          <a
                            href={sub.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F4F6F1] text-[#1B241B] border border-[#D5DEC9] text-xs font-semibold transition shadow-sm self-start hover:shadow"
                          >
                            <div className="flex items-center gap-1 font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7]">
                              {isGithub ? (
                                <Github className="w-3.5 h-3.5 text-[#1B241B]" />
                              ) : isFigma ? (
                                <Figma className="w-3.5 h-3.5 text-purple-600" />
                              ) : (
                                <LinkIcon className="w-3.5 h-3.5 text-[#525E50]" />
                              )}
                              <span>PR</span>
                            </div>
                            <span>Inspect Deliverable</span>
                            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                          </a>
                        </div>

                        {/* Architecture Summary Notes */}
                        {sub.notes && (
                          <div className="bg-[#F8F9F5] p-4 rounded-xl border border-[#E4E8DE] text-xs text-[#525E50] mb-3.5 leading-relaxed">
                            <span className="font-semibold text-[#1B241B] block mb-1">
                              Architecture &amp; Methodology:
                            </span>
                            <p className="whitespace-pre-line text-[#525E50]">{sub.notes}</p>
                          </div>
                        )}

                        {/* Reviewer Feedback Quote */}
                        {sub.feedback && (
                          <div className="bg-[#EEF2EB]/60 p-4 rounded-xl border border-[#D5DEC9] text-xs text-[#1B241B] flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#3E5239] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[#2D3B2D] block mb-0.5">
                                Verified by Startup Poster ({companyName}):
                              </span>
                              <p className="italic text-[#525E50]">&ldquo;{sub.feedback}&rdquo;</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* DANGER ZONE: ACCOUNT DELETION (Only visible to authenticated owners, not founder) */}
        {Boolean(
          isOwner &&
          profileUser?.role !== 'founder' &&
          profileUser?.email !== 'goyaltanishq269@gmail.com' &&
          !['founder', 'creator', 'tanishq', 'tanishq-goyal'].includes(String(id || '').toLowerCase())
        ) && (
          <div className="mt-12 rounded-2xl border border-rose-200/80 bg-rose-50/40 p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider font-mono">
                    Danger Zone
                  </h3>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed max-w-2xl">
                  Permanently delete your SkillTish account, portfolio data, and active task submissions. This action is irreversible.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsDeleteModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CODE INSPECTOR DRAWER (Company Review Only) */}
      {isCompany && (
        <CodeInspectorDrawer
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          submission={selectedSubmission}
          onApprove={(submissionId) => handleApproveSubmission(submissionId)}
          isActionLoading={actionLoadingId === selectedSubmission?._id}
        />
      )}

      {/* POST TASK MODAL (Company Challenge Creation Only) */}
      {isCompany && (
        <PostTaskModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onTaskCreated={() => {
            fetchTasksAndSubmissions();
          }}
        />
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userEmail={session?.user?.email || profileUser?.email}
      />

      {/* DIRECT DEVELOPER OUTREACH MODAL (Candidate Outreach) */}
      {isStudent && isHireModalOpen && (
        <div className="fixed inset-0 bg-[#1B241B]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FBFBF9] rounded-2xl border border-[#E4E8DE] max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 text-[#1B241B]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E8DE] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] flex items-center justify-center text-[#F4F6F1] font-bold shadow-sm border border-[#3E5239]">
                  <Briefcase className="w-5 h-5 text-[#D5DEC9]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1B241B] text-base">Direct Developer Outreach</h3>
                  <span className="text-[11px] font-mono text-[#374B35] font-semibold">
                    Verified Developer: {profileUser.name || 'Developer'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsHireModalOpen(false)}
                className="p-1.5 rounded-lg text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] text-xs space-y-1.5">
                <div className="flex justify-between text-[#525E50]">
                  <span>Developer Email:</span>
                  <span className="font-mono text-[#1B241B] font-semibold">{profileUser.email}</span>
                </div>
                <div className="flex justify-between text-[#525E50]">
                  <span>Institution:</span>
                  <span className="text-[#1B241B]">{profileUser.college || 'Apex Tech Institute'}</span>
                </div>
                <div className="flex justify-between text-[#525E50]">
                  <span>Credentials Minted:</span>
                  <span className="font-mono text-[#374B35] font-bold">{badges?.length || 0} Credentials</span>
                </div>
              </div>

              {/* Direct Social Channels (Candidate's own profiles only) */}
              {(profileUser.github || profileUser.linkedin) && (
                <div className="flex items-center gap-2 pt-1 pb-1">
                  <span className="text-[11px] font-semibold text-[#525E50]">Direct Profiles:</span>
                  {profileUser.github && (
                    <a
                      href={profileUser.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#D5DEC9] bg-white hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-medium transition"
                    >
                      <Github className="w-3.5 h-3.5 text-[#1B241B]" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-[#525E50]" />
                    </a>
                  )}
                  {profileUser.linkedin && (
                    <a
                      href={profileUser.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF2EB] text-[#374B35] hover:bg-[#D5DEC9] border border-[#D5DEC9] text-xs font-medium transition"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-[#3E5239]" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-[#3E5239]" />
                    </a>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#525E50] mb-1.5 font-bold">
                  Subject Line:
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-[#F2F4EE] border border-[#DEE3D7] text-xs text-[#1B241B] font-medium">
                  [SkillTish] Opportunity regarding verified credentials
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#525E50] mb-1.5 font-bold">
                  Outreach Message Draft:
                </label>
                <div className="p-3.5 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] text-xs text-[#525E50] leading-relaxed font-mono whitespace-pre-line select-all">
                  {`Hi ${profileUser.name || 'Developer'},

I reviewed your verified proof-of-work portfolio on SkillTish and was impressed by your completed project challenges and verified credentials.

We would love to schedule a brief 15-minute call regarding an engineering role at our startup.

Best regards,
Founder / Engineering Lead`}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <a
                  href={`mailto:${profileUser.email || ''}?subject=${encodeURIComponent(
                    '[SkillTish] Opportunity regarding verified credentials'
                  )}&body=${encodeURIComponent(
                    `Hi ${profileUser.name || 'Developer'},\n\nI reviewed your verified proof-of-work portfolio on SkillTish and was impressed by your completed project challenges and verified credentials.\n\nWe would love to schedule a brief 15-minute call regarding an engineering role at our startup.\n\nBest regards,\nFounder / Engineering Lead`
                  )}`}
                  className="flex-[2] py-2.5 px-4 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Email Outreach</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    navigator.clipboard.writeText(
                      `Hi ${profileUser.name || 'Developer'},\n\nI reviewed your verified proof-of-work portfolio on SkillTish and was impressed by your completed project challenges and verified credentials.\n\nWe would love to schedule a brief 15-minute call regarding an engineering role at our startup.\n\nBest regards,\nFounder / Engineering Lead`
                    );
                    setCopiedTemplate(true);
                    setTimeout(() => setCopiedTemplate(false), 2000);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#D5DEC9] bg-white hover:bg-[#F4F6F1] text-[#1B241B] font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedTemplate ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#525E50]" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
