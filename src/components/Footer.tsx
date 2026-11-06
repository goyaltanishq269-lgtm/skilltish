'use client';

import React, { useState } from 'react';
import {
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  MessageSquareCode,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const devEmail = 'goyaltanishq269@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    playClickSound();
    navigator.clipboard.writeText(devEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="border-t border-[#E3E6DC] bg-white/70 backdrop-blur-md py-12 text-xs text-[#525E50] relative z-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* GLOBAL DEVELOPER & PLATFORM ARCHITECT SUPPORT CARD */}
        <div className="rounded-2xl border border-[#E4E8DE] bg-gradient-to-br from-[#F4F6F1] via-white to-[#EEF2EB] p-6 sm:p-7 shadow-[0_1px_3px_rgba(40,50,40,0.04)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                <MessageSquareCode className="w-3.5 h-3.5 text-[#4F6850]" />
                <span>Platform Feedback &amp; Developer Support</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1B241B] tracking-tight">
                  Tanishq Goyal{' '}
                  <span className="text-xs sm:text-sm font-semibold text-[#525E50] font-normal">
                    (Lead Developer &amp; Platform Architect)
                  </span>
                </h3>
                <p className="text-xs text-[#525E50] max-w-2xl leading-relaxed mt-1">
                  SkillTish is an open-source proof-of-work protocol designed to replace credential inflation with cryptographic engineering provenance. Reach out directly for platform feedback, technical inquiries, or bug reports.
                </p>
              </div>
            </div>

            {/* Support Channels & Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Bug Report / Support Email */}
              <div className="flex items-center rounded-xl bg-white border border-[#E3E6DC] shadow-sm hover:border-[#CCD5C3] transition-all overflow-hidden">
                <a
                  href={`mailto:${devEmail}`}
                  className="flex items-center gap-2 px-3.5 py-2 text-[#1B241B] font-semibold text-xs hover:text-[#283528] transition"
                  title={`Send email to ${devEmail}`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#4F6850]" />
                  <span>Support Email</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-2 border-l border-[#E3E6DC] hover:bg-[#F4F6F1] text-[#525E50] transition cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-[#374B35]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#AAB79F]" />
                  )}
                </button>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/goyaltanishq269-lgtm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D3B2D] hover:bg-[#1B241B] text-white font-semibold text-xs shadow-sm transition hover:-translate-y-0.5"
                title="View Lead Developer GitHub"
              >
                <Github className="w-3.5 h-3.5 text-white" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-[#AAB79F] ml-0.5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/tanishq-goyal-a64279388/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#3E5239] hover:bg-[#283528] text-white font-semibold text-xs shadow-sm transition hover:-translate-y-0.5"
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-white" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-[#D5DEC9] ml-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & ENTERPRISE PROVENANCE BAR */}
        <div className="pt-6 border-t border-[#E3E6DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#525E50] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#1B241B] tracking-tight">SkillTish Enterprise</span>
            <span>•</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] font-medium">
              v2.0 Verified
            </span>
            <span>•</span>
            <span>Tamper-Proof Proof-of-Work Protocol © 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#1B241B] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#374B35]" />
              Production Verified Ledger
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
