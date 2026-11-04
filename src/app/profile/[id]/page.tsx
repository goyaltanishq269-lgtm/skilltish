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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading public portfolio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Student Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          Could not find a student profile with this ID.
        </p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          <span>Browse Active Sprints</span>
        </Link>
      </div>
    );
  }

  const user = data.user;
  const badges = data.badges || [];
  const completedTasks = data.completedTasks || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100/40 via-violet-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-indigo-500/20 shrink-0">
              {user.name?.[0] || 'A'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Builder
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-semibold text-slate-800">{user.college || 'Apex Tech Institute'}</span>
                <span>•</span>
                <span className="text-slate-500">{user.email}</span>
              </div>

              {user.bio && (
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <button
              onClick={copyShareLink}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Share Public Portfolio</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
              <div className="text-center">
                <span className="block text-lg font-extrabold text-indigo-600">
                  {badges.length}
                </span>
                <span>Verified Badges</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="text-center">
                <span className="block text-lg font-extrabold text-slate-900">
                  {completedTasks.length}
                </span>
                <span>Sprints Completed</span>
              </div>
            </div>
          </div>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Core Skills:
            </span>
            {user.skills.map((skill: string) => (
              <span
                key={skill}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Cryptographically Verifiable</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Verified Skill Badges
            </h2>
            <p className="text-xs text-slate-500">
              Earned by completing real startup sprint deliverables.
            </p>
          </div>
        </div>

        {badges.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center max-w-md mx-auto">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Badges Minted Yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Apply to micro-tasks in the feed to earn verified credentials.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <span>Explore Tasks to Earn Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges.map((badge: any) => (
              <BadgeCard key={badge._id} badge={badge} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Proof of Work</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Verified Proof of Work
            </h2>
            <p className="text-xs text-slate-500">
              Audited code repositories, pull requests, and production deliverables.
            </p>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center max-w-md mx-auto">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Approved Proof Yet</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Approved proof of work will be showcased here with direct links.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <span>Explore Tasks to Earn Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((sub: any) => {
              const isGithub = sub.proofUrl?.includes('github.com');
              const isFigma = sub.proofUrl?.includes('figma.com');
              const companyName = sub.task?.companyName || sub.task?.poster?.company || 'DevStudio';
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
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Approved
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                          {companyName}
                        </span>

                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Approved {formattedApprovedDate}
                        </span>

                        {sub.task?.duration && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {sub.task.duration} Sprint
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {sub.task?.title || 'Completed Micro-Task'}
                      </h3>
                    </div>

                    <a
                      href={sub.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm self-start"
                    >
                      {isGithub ? (
                        <Github className="w-4 h-4" />
                      ) : isFigma ? (
                        <Figma className="w-4 h-4" />
                      ) : (
                        <LinkIcon className="w-4 h-4" />
                      )}
                      <span>Inspect Deliverable</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                    </a>
                  </div>

                  {sub.notes && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 mb-3 leading-relaxed">
                      <span className="font-semibold text-slate-900 block mb-0.5">
                        Approach & Architecture:
                      </span>
                      <p className="whitespace-pre-line">{sub.notes}</p>
                    </div>
                  )}

                  {sub.feedback && (
                    <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Verified by Startup Poster ({companyName}):</span>
                        <p className="italic text-emerald-800">&ldquo;{sub.feedback}&rdquo;</p>
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
  );
}
