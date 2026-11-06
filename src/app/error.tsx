'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Caught Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
          !
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-600 mb-6 font-mono text-xs bg-slate-50 p-3 rounded border border-slate-100 overflow-x-auto text-left">
          {error?.message || 'An unexpected error occurred while rendering the page.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
