'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Mail, AlertTriangle, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

export default function EmailVerificationBanner() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If user is not logged in or email is already verified, do not render banner
  if (!session?.user || session.user.isEmailVerified !== false) {
    return null;
  }

  const handleResend = async () => {
    playClickSound();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend verification link.');
      }

      setSuccessMsg('Activation link sent! Check your inbox.');
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs font-sans text-amber-900 transition-all select-none backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
            <Mail className="w-3 h-3" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-amber-950">Email Verification Required: </span>
            <span className="text-amber-800">
              Verify (<span className="font-medium text-amber-950 underline decoration-amber-300">{session.user.email}</span>) to submit challenges and claim verified credentials.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {successMsg ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{successMsg}</span>
            </span>
          ) : errorMsg ? (
            <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/80 text-[11px] font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>{errorMsg}</span>
            </span>
          ) : null}

          <button
            onClick={handleResend}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-amber-100/60 border border-amber-300/80 text-amber-950 text-xs font-medium shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-amber-800" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 text-amber-800" />
                <span>Resend Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
