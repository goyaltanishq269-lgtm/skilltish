'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import BadgeCard from '@/components/BadgeCard';
import {
  GraduationCap,
  Award,
  ShieldCheck,
  ExternalLink,
  Github,
  Figma,
  Link as LinkIcon,
  CheckCircle2,
  Calendar,
  Share2,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Clock,
  ArrowRight,
  Building2,
  UserCheck,
} from 'lucide-react';

export default function StudentProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        throw new Error('Student profile not found');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error loading profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] bg-[#09090b] flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-400">Loading public portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] bg-[#09090b] flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full border border-white/10 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Student Not Found</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6">
            Could not find a student profile with this ID.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition"
          >
            <span>Browse Active Sprints</span>
          </Link>
        </div>
      </div>
    );
  }

  const user = data.user;
  const badges = data.badges || [];
  const completedTasks = data.completedTasks || [];

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-zinc-100">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* STUDENT IDENTITY CARD (HEADER) */}
        <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-violet-600 text-zinc-950 font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                <span className="text-white">{user.name?.[0] || 'A'}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Builder
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{user.college || 'Apex Tech Institute'}</span>
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400 font-mono text-xs">{user.email}</span>
                </div>

                {user.bio && (
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed font-normal">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3.5 shrink-0">
              {/* Primary "Share Public Portfolio" button */}
              <button
                onClick={copyShareLink}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-zinc-400" />
                    <span>Share Public Portfolio</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400 pt-1">
                <div className="text-center">
                  <span className="block text-xl font-extrabold text-emerald-400 font-mono">
                    {badges.length}
                  </span>
                  <span>Verifiable Badges</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <span className="block text-xl font-extrabold text-white font-mono">
                    {completedTasks.length}
                  </span>
                  <span>Sprints Completed</span>
                </div>
              </div>
            </div>
          </div>

          {user.skills && user.skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mr-1">
                Core Stack:
              </span>
              {user.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/10"
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Cryptographically Verifiable</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Verified Skill <span className="gradient-text">Badges</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Earned through direct code inspections and startup founder approvals.
              </p>
            </div>
          </div>

          {badges.length === 0 ? (
            <div className="glass-card rounded-3xl border border-dashed border-white/10 p-10 text-center max-w-md mx-auto">
              <Award className="w-10 h-10 text-zinc-500 mx-auto mb-2.5" />
              <h4 className="text-sm font-bold text-white">No Badges Minted Yet</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-5">
                Apply to micro-tasks in the feed to earn verified credentials.
              </p>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-bold shadow-md transition"
              >
                <span>Explore Tasks to Earn Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge: any) => (
                <BadgeCard key={badge._id} badge={badge} />
              ))}
            </div>
          )}
        </div>

        {/* PROOF-OF-WORK DELIVERABLES SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Production Deliverables</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Verified Proof of <span className="gradient-text-emerald">Work</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Audited code repositories, pull requests, and production deliverables.
              </p>
            </div>
          </div>

          {completedTasks.length === 0 ? (
            <div className="glass-card rounded-3xl border border-dashed border-white/10 p-10 text-center max-w-md mx-auto">
              <CheckCircle2 className="w-10 h-10 text-zinc-500 mx-auto mb-2.5" />
              <h4 className="text-sm font-bold text-white">No Approved Deliverables Yet</h4>
              <p className="text-xs text-zinc-400 mt-1 mb-5">
                Approved pull requests and designs will be showcased here with direct links.
              </p>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 text-xs font-bold shadow-md transition"
              >
                <span>Explore Tasks to Earn Proof</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {completedTasks.map((sub: any) => {
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
                    key={sub._id}
                    className="glass-card rounded-3xl border border-white/10 p-6 sm:p-7 shadow-lg hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Approved &amp; Audited
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 text-xs font-semibold border border-white/10">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                            {companyName}
                          </span>

                          <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-zinc-500" />
                            Approved {formattedApprovedDate}
                          </span>

                          {sub.task?.duration && (
                            <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              {sub.task.duration} Sprint
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white">
                          {sub.task?.title || 'Completed Micro-Task'}
                        </h3>
                      </div>

                      <a
                        href={sub.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 text-xs font-bold transition shadow-sm self-start"
                      >
                        {isGithub ? (
                          <Github className="w-4 h-4 text-emerald-400" />
                        ) : isFigma ? (
                          <Figma className="w-4 h-4 text-purple-400" />
                        ) : (
                          <LinkIcon className="w-4 h-4 text-zinc-400" />
                        )}
                        <span>Inspect Deliverable</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                      </a>
                    </div>

                    {/* Architecture Summary Notes */}
                    {sub.notes && (
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.06] text-xs text-zinc-300 mb-3.5 leading-relaxed">
                        <span className="font-semibold text-white block mb-1">
                          Architecture &amp; Methodology:
                        </span>
                        <p className="whitespace-pre-line text-zinc-300">{sub.notes}</p>
                      </div>
                    )}

                    {/* Reviewer Feedback Quote */}
                    {sub.feedback && (
                      <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-300 block mb-0.5">
                            Verified by Startup Poster ({companyName}):
                          </span>
                          <p className="italic text-zinc-300">&ldquo;{sub.feedback}&rdquo;</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
