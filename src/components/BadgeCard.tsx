import React from 'react';
import { Award, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

interface BadgeCardProps {
  badge: {
    _id: string;
    title: string;
    skill: string;
    issuedAt: string;
    task?: {
      title?: string;
      duration?: string;
    };
  };
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const formattedDate = new Date(badge.issuedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30 p-5 shadow-sm hover:shadow-md transition group">
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-gradient-to-br from-indigo-200/40 to-violet-200/0 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <Award className="w-6 h-6" />
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified
        </span>
      </div>

      <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
        {badge.title}
      </h4>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
          {badge.skill}
        </span>
        {badge.task?.duration && (
          <span className="text-[11px] text-slate-500">
            • {badge.task.duration} task
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-indigo-100/60 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Issued {formattedDate}
        </span>
        <span className="text-[11px] font-medium text-indigo-600 flex items-center gap-0.5">
          <Sparkles className="w-3 h-3" />
          On-Chain Proof
        </span>
      </div>
    </div>
  );
}
