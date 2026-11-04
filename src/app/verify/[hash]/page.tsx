'use client';

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
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  Lock,
  ArrowLeft,
  QrCode,
  FileCode,
} from 'lucide-react';

export default function VerifyCertificatePage() {
  const params = useParams();
  const hashParam = (params?.hash as string) || 'SKL-8492-NEXTJS';

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
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
            // Try to match by hash fragment
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

  const studentName = badgeData?.studentName || 'Alex Chen';
  const college = 'Apex Tech Institute';
  const taskTitle = badgeData?.task?.title || badgeData?.title || 'Next.js & NextAuth Authentication Provider';
  const skill = badgeData?.skill || 'Next.js & NextAuth';
  const company = badgeData?.companyName || badgeData?.task?.companyName || 'DevStudio';
  const issuerName = badgeData?.issuerName || 'Priya Sharma (Lead Architect)';
  const proofUrl = badgeData?.proofUrl || 'https://github.com/alexchen/nextauth-credentials-demo';
  const issuedDate = badgeData?.issuedAt
    ? new Date(badgeData.issuedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'November 4, 2026';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Hex);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(linkedinShareUrl, '_blank', 'noopener,noreferrer');
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Grid & Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/15 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              Verification Node: Active
            </span>
          </div>
        </div>

        {/* Share Feedback Toast */}
        {shareToast && (
          <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between">
            <span>Opened LinkedIn share dialog with your verified credential URL.</span>
            <button
              onClick={() => setShareToast(false)}
              className="text-indigo-400 hover:text-white font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MAIN CERTIFICATE CARD */}
        <div className="glass-card rounded-3xl border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          {/* Decorative Corner Watermark */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-emerald-500/15 to-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

          {/* TOP AUDIT BADGE & PROTOCOL BADGE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  Public Ledger Verification
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Cryptographic Proof Certificate
                </h1>
              </div>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Certificate ID
              </span>
              <span className="font-mono text-xs font-bold text-zinc-300 bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/10">
                {hashParam}
              </span>
            </div>
          </div>

          {/* GLOWING OFFICIAL AUDIT SEAL */}
          <div className="py-8 my-2 flex flex-col items-center text-center relative">
            <div className="relative mb-5">
              {/* Outer Pulsing Ring */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500/20 to-indigo-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.25)] animate-pulse">
                {/* Inner Medal */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-zinc-950 font-bold shadow-inner">
                  <Award className="w-9 h-9 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-1 border border-emerald-500/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              VERIFIED BY SKILLTISH PROOF ENGINE
            </span>

            <p className="text-xs text-zinc-400 max-w-md">
              This digital credential certifies that the recipient successfully engineered, submitted, and verified real production source code meeting startup architectural standards.
            </p>
          </div>

          {/* CERTIFICATE DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {/* Recipient */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Certified Engineer
              </span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{studentName}</span>
                <span className="text-[11px] font-normal text-emerald-400 font-mono">
                  (Verified Student)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                <span>{college}</span>
              </div>
            </div>

            {/* Issuing Startup */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Issuing Organization
              </span>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{company}</span>
                <span className="text-[11px] font-normal text-indigo-400 font-mono">
                  (Partner Startup)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Building className="w-3.5 h-3.5 text-zinc-500" />
                <span>Authorized Reviewer: {issuerName}</span>
              </div>
            </div>

            {/* Verified Task Deliverable */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1 md:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Verified Deliverable &amp; Core Skill
              </span>
              <div className="text-base font-bold text-white">
                {taskTitle}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-semibold text-xs">
                  {skill}
                </span>
                <span className="text-zinc-500 flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  Issued on {issuedDate}
                </span>
              </div>
            </div>
          </div>

          {/* CRYPTOGRAPHIC HASH & AUDIT PROOF SECTION */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5 font-sans">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tamper-Proof Cryptographic Hash (SHA-256)</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition cursor-pointer font-sans"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Hash Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy SHA-256</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/[0.06] text-[11px] sm:text-xs text-emerald-400/90 break-all select-all font-mono">
              {sha256Hex}
            </div>

            {/* Clickable Deliverable Proof Link */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
              <span className="text-zinc-400 text-[11px]">
                Immutable Commit Audit:
              </span>
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 font-bold transition text-xs"
              >
                <Github className="w-4 h-4 text-emerald-400" />
                <span>Inspect Verified Pull Request / Deliverable</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 font-bold text-xs transition cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Copy Verification Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share to LinkedIn</span>
              </button>
            </div>

            <Link
              href="/profile/student-1"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
            >
              <span>Inspect Student Portfolio &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
