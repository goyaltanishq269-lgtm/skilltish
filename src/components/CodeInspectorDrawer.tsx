'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GitCommit,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  ShieldCheck,
  FileCode,
  GraduationCap,
  Calendar,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface CodeInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submission: any | null;
  onApprove: (submissionId: string) => Promise<void> | void;
  isActionLoading?: boolean;
}

export default function CodeInspectorDrawer({
  isOpen,
  onClose,
  submission,
  onApprove,
  isActionLoading = false,
}: CodeInspectorDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!submission) return null;

  const studentName = submission.student?.name || submission.studentName || 'Alex Chen';
  const college = submission.student?.college || 'Apex Tech Institute';
  const taskTitle = submission.task?.title || 'Next.js & NextAuth Authentication Flow';
  const proofUrl =
    submission.proofUrl ||
    'https://github.com/alexchen/nextauth-credentials-demo';
  const isApproved = submission.status === 'approved';

  const handleCopyCommit = () => {
    navigator.clipboard.writeText('git checkout a9f81d3e840');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-zinc-950/95 border-l border-white/10 backdrop-blur-2xl z-50 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* TOP BAR / HEADER */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-emerald-500/20">
                  <GitPullRequest className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      Code Inspector
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      PR #42 Verified
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Proof-of-Work Pull Request
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SUBMISSION & STUDENT SUMMARY CARD */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {taskTitle}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="font-semibold text-zinc-200">
                        {studentName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-zinc-400">
                        <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                        {college}
                      </span>
                    </div>
                  </div>

                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition shrink-0"
                  >
                    <span>Inspect GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {submission.notes && (
                  <div className="text-xs text-zinc-300 bg-black/40 p-3 rounded-xl border border-white/[0.06] font-mono leading-relaxed">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-sans block mb-1 font-bold">
                      Student Implementation Brief:
                    </span>
                    &ldquo;{submission.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* SIMULATED GIT COMMIT & CI/CD BADGES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono uppercase font-bold tracking-wider text-zinc-400">
                    Git Provenance
                  </span>
                  <button
                    onClick={handleCopyCommit}
                    className="flex items-center gap-1 hover:text-white transition font-mono text-[11px] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied checkout</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-500" />
                        <span>Copy checkout command</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-200 font-bold">a9f81d3</span>
                    <span className="text-zinc-500">•</span>
                    <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-400">main</span>
                  </div>

                  <div className="text-zinc-400 text-[11px]">
                    <span className="text-emerald-400 font-semibold">+142</span>{' '}
                    <span className="text-rose-400 font-semibold">-38</span> in 3 files
                  </div>
                </div>

                {/* CI/CD STATUS PILLS */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Build: Passing</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>TypeCheck: 0</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 flex items-center gap-1.5 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Audit Clean</span>
                  </div>
                </div>
              </div>

              {/* SYNTAX HIGHLIGHTED CODE DIFF PREVIEW */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span>Verified Diff Preview</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    src/lib/auth.ts
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden text-xs font-mono shadow-inner">
                  {/* File header bar */}
                  <div className="px-4 py-2 bg-zinc-900/80 border-b border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="text-zinc-300 font-semibold">
                      @@ -14,10 +14,18 @@ export const authOptions: NextAuthOptions = {'{'}
                    </span>
                    <span className="text-zinc-500">Unified Role Schema</span>
                  </div>

                  {/* Diff Content */}
                  <div className="p-4 space-y-0.5 overflow-x-auto leading-relaxed select-text">
                    <div className="text-zinc-500 pl-4">  providers: [</div>
                    <div className="text-zinc-500 pl-4">    CredentialsProvider({'{'}</div>
                    <div className="text-zinc-500 pl-4">      name: &apos;Credentials&apos;,</div>
                    <div className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">-</span>
                      <span>      // old mock user without role validation</span>
                    </div>
                    <div className="bg-rose-950/40 text-rose-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">-</span>
                      <span>      return {'{'} id: &apos;1&apos;, email: credentials?.email {'}'};</span>
                    </div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      const user = await User.findOne({'{'} email: credentials?.email {'}'});</span>
                    </div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      if (!user) throw new Error(&apos;Account not found&apos;);</span>
                    </div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      return {'{'} id: user._id, role: user.role, name: user.name {'}'};</span>
                    </div>
                    <div className="text-zinc-500 pl-4">    {'}'})</div>
                    <div className="text-zinc-500 pl-4">  ],</div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>  callbacks: {'{'}</span>
                    </div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>    async session({'{'} session, token {'}'}) {'{'}</span>
                    </div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      session.user.role = token.role; return session;</span>
                    </div>
                    <div className="bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>    {'}'}</span>
                    </div>
                    <div className="text-zinc-500 pl-4">  {'}'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-6 border-t border-white/10 bg-zinc-900/60 backdrop-blur-xl space-y-3">
              {isApproved ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>This deliverable has been verified and minted.</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/[0.05] text-zinc-300 hover:text-white font-bold text-xs transition cursor-pointer"
                  >
                    Close Preview
                  </button>

                  <button
                    onClick={async () => {
                      await onApprove(submission._id);
                    }}
                    disabled={isActionLoading}
                    className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-zinc-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Award className="w-4 h-4 text-zinc-950" />
                    <span>Approve Deliverable &amp; Mint Badge</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
