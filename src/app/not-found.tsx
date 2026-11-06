import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBF9] flex items-center justify-center p-4 text-[#1B241B] font-sans">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-10 max-w-md w-full border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] text-center relative">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF2EB] text-[#3E5239] flex items-center justify-center mx-auto mb-4 border border-[#D5DEC9] shadow-sm">
          <FileQuestion className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-3 font-mono">
          <span>Error 404 • Ledger Record Missing</span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#1B241B] tracking-tight mb-2">
          Page or Record Not Found
        </h1>

        <p className="text-xs sm:text-sm text-[#525E50] leading-relaxed mb-6 font-normal">
          The requested route, verified developer portfolio, or challenge deliverable could not be located in the provenance ledger.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/feed"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] text-xs font-semibold shadow-sm transition hover:-translate-y-0.5"
          >
            <span>Explore Challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F4F6F1] text-[#1B241B] text-xs font-semibold border border-[#D5DEC9] transition"
          >
            <Home className="w-4 h-4 text-[#525E50]" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
