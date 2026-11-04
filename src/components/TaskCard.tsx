import React from 'react';
import Link from 'next/link';
import { Clock, Building2, CheckCircle2, ArrowRight, Award } from 'lucide-react';

interface TaskCardProps {
  task: {
    _id: string;
    title: string;
    description: string;
    skillsRequired: string[];
    duration: string;
    status: string;
    stipendOrPerks?: string;
    reward?: string;
    companyName?: string;
    posterName?: string;
    poster?: {
      name?: string;
      company?: string;
    };
    createdAt?: string;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const durationUpper = (task.duration || '3 days').toUpperCase();

  // Distinctive monospace sprint badge styling
  const durationBadgeStyle: Record<string, string> = {
    '1 DAY': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    '3 DAYS': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    '1 WEEK': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    '2 WEEKS': 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };

  const badgeStyle =
    durationBadgeStyle[durationUpper] || 'bg-white/[0.05] text-zinc-300 border-white/10';
  const company =
    task.companyName || task.poster?.company || task.posterName || task.poster?.name || 'DevStudio';
  const companyInitial = company[0] || 'D';

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] hover:border-emerald-500/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.08)] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header: Sprint Badge + Open Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider border ${badgeStyle}`}
            >
              <Clock className="w-3 h-3" />
              {durationUpper}
            </span>

            {task.status === 'open' ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                OPEN
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                CLOSED
              </span>
            )}
          </div>
        </div>

        {/* Task Title */}
        <Link href={`/tasks/${task._id}`}>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
            {task.title}
          </h3>
        </Link>

        {/* Task Description */}
        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-normal">
          {task.description}
        </p>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {task.skillsRequired.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:border-white/20 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            {companyInitial}
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-semibold text-zinc-200 truncate">
              {company}
            </span>
            <span className="block text-[10px] text-zinc-400 truncate flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-400 shrink-0" />
              {task.stipendOrPerks || task.reward || 'Verified Badge'}
            </span>
          </div>
        </div>

        <Link
          href={`/tasks/${task._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0 pl-2 group/btn"
        >
          <span>Inspect Task</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
