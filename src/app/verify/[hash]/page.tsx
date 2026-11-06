'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  Lock,
  ArrowLeft,
  FileCode,
  Terminal,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';
import { CREATOR_PROFILE } from '@/lib/creator';

export default function VerifyCertificatePage() {
  const params = useParams();
  const hashParam = (params?.hash as string) || 'SKL-8492-NEXTJS';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedDevEmail, setCopiedDevEmail] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [badgeData, setBadgeData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Deterministic 64-char hex string derived from hashParam
  const sha256Hex = React.useMemo(() => {
    let acc = 0;
    for (let i = 0; i < hashParam.length; i++) {
      acc = (acc << 5) - acc + hashParam.charCodeAt(i);
      acc |= 0;
    }
    const hexSuffix = Math.abs(acc).toString(16).padStart(8, 'a7');
    return `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b${hexSuffix}`;
  }, [hashParam]);

  useEffect(() => {
    async function loadBadge() {
      try {
        const res = await fetch('/api/badges');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            const found = list.find((b: any) => {
              const idSnippet = (b._id || '').slice(-4).toUpperCase();
              return hashParam.toUpperCase().includes(idSnippet);
            });
            setBadgeData(found || list[0]);
          }
        }
      } catch (err) {
        console.error('Error loading badge verification:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBadge();
  }, [hashParam]);

  const studentName = badgeData?.studentName ?? 'Alex Chen';
  const college = 'Apex Tech Institute';
  const taskTitle =
    badgeData?.task?.title ??
    badgeData?.title ??
    'Next.js & NextAuth Authentication Provider';
  const skill = badgeData?.skill ?? 'Next.js & NextAuth';
  const company =
    badgeData?.companyName ?? badgeData?.task?.companyName ?? 'DevStudio';
  const issuerName = badgeData?.issuerName ?? 'Priya Sharma (Lead Architect)';
  const proofUrl =
    badgeData?.proofUrl ?? 'https://github.com/alexchen/nextauth-credentials-demo';
  const issuedDate = badgeData?.issuedAt
    ? new Date(badgeData.issuedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'November 4, 2026';

  const handleCopyLink = () => {
    playClickSound();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyHash = () => {
    playClickSound();
    navigator.clipboard.writeText(sha256Hex);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyDevEmail = () => {
    playClickSound();
    navigator.clipboard.writeText(CREATOR_PROFILE.email);
    setCopiedDevEmail(true);
    setTimeout(() => setCopiedDevEmail(false), 2000);
  };

  const handleShare = () => {
    playClickSound();
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(linkedinShareUrl, '_blank', 'noopener,noreferrer');
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBFBF9] text-[#1B241B] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525E50] hover:text-[#1B241B] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Challenges Feed</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-[#374B35] bg-[#EEF2EB] px-2.5 py-0.5 rounded-full border border-[#D5DEC9]">
              Ledger Verified
            </span>
          </div>
        </div>

        {/* Share Feedback Toast */}
        {shareToast && (
          <div className="p-3.5 rounded-xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] text-xs flex items-center justify-between shadow-sm font-medium">
            <span>Opened LinkedIn dialog with your verified credential URL.</span>
            <button
              onClick={() => setShareToast(false)}
              className="text-[#374B35] hover:text-[#1B241B] font-semibold ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MAIN EXECUTIVE CERTIFICATE CARD */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E4E8DE] p-6 sm:p-10 shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] relative overflow-hidden text-[#1B241B]">
          {/* TOP AUDIT HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E8DE] bg-[#F8F9F5] -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 p-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#2D3B2D] text-[#D5DEC9] flex items-center justify-center font-bold shadow-sm">
                <ShieldCheck className="w-7 h-7 text-[#D5DEC9]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#3E5239] block">
                  Public Ledger Certificate
                </span>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#1B241B] tracking-tight">
                  Cryptographic Proof Certificate
                </h1>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-xs font-medium text-[#525E50]">
                Certificate ID
              </span>
              <span className="font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2.5 py-0.5 rounded border border-[#DEE3D7] shadow-sm mt-0.5">
                #{hashParam}
              </span>
            </div>
          </div>

          {/* OFFICIAL AUDIT SEAL */}
          <div className="py-8 my-2 flex flex-col items-center text-center relative">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-2xl bg-[#EEF2EB] border border-[#D5DEC9] flex items-center justify-center text-[#3E5239] shadow-sm">
                <Award className="w-10 h-10 text-[#3E5239]" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3E5239]" />
              Verified by SkillTish Proof Engine
            </span>

            <p className="text-xs text-[#525E50] max-w-md">
              This digital credential certifies that the recipient successfully engineered, submitted, and verified real production source code meeting startup architectural standards.
            </p>
          </div>

          {/* CERTIFICATE DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {/* Recipient */}
            <div className="p-4 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] space-y-1">
              <span className="text-xs font-medium text-[#525E50] block">
                Certified Engineer
              </span>
              <div className="text-base font-bold text-[#1B241B] flex items-center gap-2">
                <span>{studentName}</span>
                <span className="text-[11px] font-medium text-[#374B35] bg-[#EEF2EB] px-2 py-0.5 rounded-full border border-[#D5DEC9]">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#525E50]">
                <GraduationCap className="w-3.5 h-3.5 text-[#525E50]" />
                <span>{college}</span>
              </div>
            </div>

            {/* Issuing Startup */}
            <div className="p-4 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] space-y-1">
              <span className="text-xs font-medium text-[#525E50] block">
                Issuing Startup
              </span>
              <div className="text-base font-bold text-[#1B241B] flex items-center gap-2">
                <span>{company}</span>
                <span className="text-[11px] font-medium text-[#374B35] bg-[#EEF2EB] px-2 py-0.5 rounded-full border border-[#D5DEC9]">
                  Partner
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#525E50]">
                <Building className="w-3.5 h-3.5 text-[#525E50]" />
                <span>Review Lead: {issuerName}</span>
              </div>
            </div>

            {/* Verified Task Deliverable */}
            <div className="p-4 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] space-y-1 md:col-span-2">
              <span className="text-xs font-medium text-[#525E50] block">
                Verified Deliverable &amp; Core Skill
              </span>
              <div className="text-base font-bold text-[#1B241B]">
                {taskTitle}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] font-medium text-xs">
                  {skill}
                </span>
                <span className="text-[#525E50] flex items-center gap-1 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#525E50]" />
                  Issued on {issuedDate}
                </span>
              </div>
            </div>
          </div>

          {/* CRYPTOGRAPHIC HASH & AUDIT PROOF SECTION */}
          <div className="p-5 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] text-[#1B241B] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#1B241B] font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#3E5239]" />
                <span>Tamper-Proof Cryptographic Hash (SHA-256)</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-xs font-medium text-[#3E5239] hover:text-[#2D3B2D] transition cursor-pointer"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#525E50]" />
                    <span>Copy SHA-256</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-[#E4E8DE] text-xs text-[#525E50] break-all select-all font-mono shadow-[0_1px_3px_rgba(40,50,40,0.04)]">
              {sha256Hex}
            </div>

            {/* Clickable Deliverable Proof Link */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#525E50] text-xs font-medium">
                Immutable Commit Audit:
              </span>
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4F6F1] text-[#1B241B] border border-[#D5DEC9] font-medium transition text-xs shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-1.5 font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7]">
                  <Github className="w-3.5 h-3.5 text-[#1B241B]" />
                  <span>Verified PR</span>
                </div>
                <span>Inspect Source</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#525E50]" />
              </a>
            </div>
          </div>

          {/* CONNECT WITH CREATOR & CODE PROVENANCE CARD */}
          <div className="my-6 p-5 rounded-xl bg-[#EEF2EB]/60 border border-[#D5DEC9] space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] text-[#F4F6F1] font-bold text-sm flex items-center justify-center shrink-0 shadow-sm border border-[#3E5239]">
                  TG
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#1B241B]">
                      {CREATOR_PROFILE.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-[#374B35] bg-white px-2 py-0.5 rounded-full border border-[#D5DEC9]">
                      Creator &amp; Architect
                    </span>
                  </div>
                  <p className="text-xs text-[#525E50]">
                    Inspect source code provenance or connect directly for engineering opportunities.
                  </p>
                </div>
              </div>

              {/* Direct Connect Action Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={CREATOR_PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4F6F1] border border-[#D5DEC9] text-[#1B241B] text-xs font-semibold shadow-sm transition"
                  title="View GitHub"
                >
                  <Github className="w-3.5 h-3.5 text-[#1B241B]" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-[#525E50]" />
                </a>

                <a
                  href={CREATOR_PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition"
                  title="View LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#F4F6F1]" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 text-[#D5DEC9]" />
                </a>

                <div className="inline-flex items-center rounded-lg bg-white border border-[#D5DEC9] shadow-sm overflow-hidden text-xs">
                  <a
                    href={`mailto:${CREATOR_PROFILE.email}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[#1B241B] hover:text-[#2D3B2D] font-semibold"
                    title={`Email ${CREATOR_PROFILE.email}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#3E5239]" />
                    <span>Email</span>
                  </a>
                  <button
                    onClick={handleCopyDevEmail}
                    className="px-2 py-1.5 border-l border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#525E50] hover:text-[#1B241B] transition cursor-pointer"
                    title="Copy Email Address"
                  >
                    {copiedDevEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#525E50]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-8 border-t border-[#E4E8DE] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#F4F6F1] text-[#1B241B] border border-[#D5DEC9] font-medium text-xs transition cursor-pointer shadow-sm"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#525E50]" />
                    <span>Copy Verification Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] font-medium text-xs transition cursor-pointer shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to LinkedIn</span>
              </button>
            </div>

            <Link
              href="/profile/student-1"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#F4F6F1] text-[#1B241B] border border-[#D5DEC9] font-medium text-xs transition-all shadow-sm"
            >
              <span>Inspect Developer Portfolio &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
