import React from 'react';
import Link from 'next/link';
import { Clock, Building2, CheckCircle2, ChevronRight, Award } from 'lucide-react';

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
  const durationColors: Record<string, string> = {
    '1 day': 'bg-amber-50 text-amber-700 border-amber-200',
    '3 days': 'bg-blue-50 text-blue-700 border-blue-200',
    '1 week': 'bg-purple-50 text-purple-700 border-purple-200',
    '2 weeks': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const durationBadgeStyle =
    durationColors[task.duration] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${durationBadgeStyle}`}
            >
              <Clock className="w-3.5 h-3.5" />
              {task.duration}
            </span>
            {task.status === 'open' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Closed
              </span>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs font-medium text-slate-500 flex items-center justify-end gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.companyName || task.poster?.company || task.posterName || task.poster?.name || 'DevStudio'}</span>
            </div>
          </div>
        </div>

        <Link href={`/tasks/${task._id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
            {task.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.skillsRequired.map((skill) => (
            <span
              key={skill}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/70 px-2.5 py-1 rounded-lg">
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span className="truncate max-w-[150px] sm:max-w-[200px]">
            {task.stipendOrPerks || task.reward || 'Verified Badge'}
          </span>
        </div>

        <Link
          href={`/tasks/${task._id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          <span>View Task</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
