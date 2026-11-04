'use client';

import React, { useState } from 'react';
import { Mail, Github, Linkedin, Copy, Check, Sparkles, Code2, Heart } from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

export default function Footer() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = 'tanishqgoyal.work@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    playClickSound();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl py-10 text-xs text-zinc-400 relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Row: Brand & Engineering Signature */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight gradient-text">
                SkillTish
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                v2.0 Production
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Designed &amp; Engineered by{' '}
              <strong className="text-zinc-200 font-semibold">Tanishq Goyal</strong> • B.Tech Computer Science &amp; Engineering.
            </p>
          </div>

          {/* Interactive Contact & Social Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Email Pill with 1-click copy */}
            <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 transition group">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-300 group-hover:text-white font-medium text-xs"
                title={`Send email to ${email}`}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get in Touch</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="px-2 py-1.5 border-l border-white/10 hover:bg-white/[0.08] text-zinc-400 hover:text-white rounded-r-xl transition cursor-pointer"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200" />
                )}
              </button>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/tanishqgoyal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-xs transition shadow-sm"
            >
              <Github className="w-3.5 h-3.5 text-zinc-300" />
              <span>GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/tanishq-goyal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white font-medium text-xs transition shadow-sm"
            >
              <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bottom Row: Tech Stack & Verification Proof */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span>SkillTish © 2026</span>
            <span>•</span>
            <span>Proof-of-Work Verifiable Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Production Ready
            </span>
            <span>•</span>
            <span>SHA-256 Tamper-Proof Badges</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
