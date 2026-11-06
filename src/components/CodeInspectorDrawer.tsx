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
  ShieldCheck,
  FileCode,
  GraduationCap,
  Copy,
  Check,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

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
    playClickSound();
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
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 transition-opacity"
          />

          {/* Slide-over Drawer: Clean Linear/Stripe engineering design */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white border-l border-slate-200/70 z-50 shadow-2xl flex flex-col justify-between overflow-hidden text-slate-800"
          >
            {/* STICKY TOP BAR / HEADER */}
            <div className="sticky top-0 z-20 px-6 py-4 border-b border-[#E4E8DE] flex items-center justify-between bg-white/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D3B2D] flex items-center justify-center text-[#D5DEC9] font-bold shadow-sm shadow-[#2D3B2D]/20">
                  <GitPullRequest className="w-5 h-5 text-[#D5DEC9]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#374B35]">
                      Code Inspector
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] font-mono">
                      PR #42 Ready for Review
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#1B241B] tracking-tight">
                    Proof-of-Work Pull Request
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#525E50] hover:text-[#1B241B] hover:bg-[#F2F4EE] transition cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SUBMISSION & STUDENT SUMMARY CARD */}
              <div className="p-4 rounded-xl bg-[#F8F9F5] border border-[#E4E8DE] space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1B241B] mb-0.5">
                      {taskTitle}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#525E50]">
                      <span className="font-semibold text-[#1B241B]">
                        {studentName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#525E50]">
                        <GraduationCap className="w-3.5 h-3.5 text-[#3E5239]" />
                        {college}
                      </span>
                    </div>
                  </div>

                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-semibold transition shrink-0 shadow-sm hover:shadow"
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7]">
                      <GitPullRequest className="w-3.5 h-3.5 text-[#3E5239]" />
                      <span>PR #{proofUrl.split('/').pop() || '42'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#525E50]" />
                  </a>
                </div>

                {submission.notes && (
                  <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 block mb-1 font-semibold">
                      Student Implementation Brief:
                    </span>
                    &ldquo;{submission.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* SIMULATED GIT COMMIT & CI/CD BADGES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Git Provenance
                  </span>
                  <button
                    onClick={handleCopyCommit}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition text-[11px] font-mono cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium">Copied checkout</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy checkout command</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F2F4EE]/60 border border-[#E4E8DE] font-mono text-xs flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-[#3E5239]" />
                    <span className="text-[#1B241B] font-semibold">a9f81d3</span>
                    <span className="text-[#889684]">•</span>
                    <GitBranch className="w-3.5 h-3.5 text-[#525E50]" />
                    <span className="text-[#525E50]">main</span>
                  </div>

                  <div className="text-[#525E50] text-[11px]">
                    <span className="text-emerald-700 font-semibold">+142</span>{' '}
                    <span className="text-rose-700 font-semibold">-38</span> in 3 files
                  </div>
                </div>

                {/* CI/CD STATUS PILLS */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center gap-1.5 justify-center font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>Build: Passing</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] flex items-center gap-1.5 justify-center font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#3E5239]" />
                    <span>TypeCheck: 0</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F2F4EE] border border-[#E4E8DE] text-[#374B35] flex items-center gap-1.5 justify-center font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3E5239]" />
                    <span>Audit Clean</span>
                  </div>
                </div>
              </div>

              {/* STRICTLY LIGHT EDITORIAL SYNTAX CODE DIFF PREVIEW */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1B241B] font-medium flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#3E5239]" />
                    <span>Verified Diff Preview</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#525E50]">
                    src/lib/auth.ts
                  </span>
                </div>

                <div className="rounded-xl border border-[#E4E8DE] bg-[#F2F4EE]/40 text-[#1B241B] overflow-hidden text-xs font-mono shadow-sm">
                  {/* Editor Top Bar */}
                  <div className="px-4 py-2 bg-[#F2F4EE] border-b border-[#E4E8DE] text-[11px] text-[#525E50] flex items-center justify-between font-sans">
                    <span className="font-mono text-[#1B241B] font-semibold">
                      @@ -14,10 +14,18 @@ export const authOptions: NextAuthOptions = {'{'}
                    </span>
                    <span className="text-[#525E50]">Strict Schema</span>
                  </div>

                  {/* Clean Light Diff Content */}
                  <div className="p-4 space-y-0.5 overflow-x-auto leading-relaxed select-text font-mono text-xs">
                    <div className="text-slate-500 pl-4">  providers: [</div>
                    <div className="text-slate-500 pl-4">    CredentialsProvider({'{'}</div>
                    <div className="text-slate-500 pl-4">      name: &apos;Credentials&apos;,</div>
                    
                    {/* Removal Lines */}
                    <div className="bg-rose-50 text-rose-800 border-l-2 border-rose-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">-</span>
                      <span>      // old mock user without role validation</span>
                    </div>
                    <div className="bg-rose-50 text-rose-800 border-l-2 border-rose-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">-</span>
                      <span>      return {'{'} id: &apos;1&apos;, email: credentials?.email {'}'};</span>
                    </div>

                    {/* Addition Lines */}
                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      const user = await User.findOne({'{'} email: credentials?.email {'}'});</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      if (!user) throw new Error(&apos;Account not found&apos;);</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      return {'{'} id: user._id, role: user.role, name: user.name {'}'};</span>
                    </div>
                    
                    <div className="text-slate-500 pl-4">    {'}'})</div>
                    <div className="text-slate-500 pl-4">  ],</div>

                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>  callbacks: {'{'}</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>    async session({'{'} session, token {'}'}) {'{'}</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>      session.user.role = token.role; return session;</span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 px-2 py-0.5 -mx-2 flex">
                      <span className="w-4 select-none opacity-60">+</span>
                      <span>    {'}'}</span>
                    </div>
                    <div className="text-slate-500 pl-4">  {'}'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-6 border-t border-slate-200/80 bg-slate-50/60 space-y-3">
              {isApproved ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>This deliverable has been verified and credential issued.</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 font-semibold hover:bg-slate-100 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#1B241B] font-semibold text-xs transition cursor-pointer"
                  >
                    Close Preview
                  </button>

                  <button
                    onClick={async () => {
                      playClickSound();
                      await onApprove(submission._id);
                    }}
                    disabled={isActionLoading}
                    className="flex-[2] py-2.5 px-4 rounded-xl bg-[#2D3B2D] hover:bg-[#1B241B] text-[#F4F6F1] shadow-sm active:scale-[0.98] transition-transform font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Award className="w-4 h-4 text-[#D5DEC9]" />
                    <span>Approve Deliverable &amp; Issue Credential</span>
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
