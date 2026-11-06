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

  // Modern clean badge colors matching Olive & Nature design tokens
  const durationBadgeStyle: Record<string, string> = {
    '1 DAY': 'bg-[#EEF2EB] text-[#374B35] border-[#D5DEC9]',
    '3 DAYS': 'bg-[#F4F6F1] text-[#3E5239] border-[#D5DEC9]',
    '1 WEEK': 'bg-[#F2F4EE] text-[#414E3F] border-[#DEE3D7]',
    '2 WEEKS': 'bg-[#EDEFE6] text-[#2D3B2D] border-[#CCD5C3]',
  };

  const badgeColor =
    durationBadgeStyle[durationUpper] || 'bg-[#F2F4EE] text-[#414E3F] border-[#DEE3D7]';
  const company =
    task.companyName || task.poster?.company || task.posterName || task.poster?.name || 'DevStudio';
  const companyInitial = company[0] || 'D';

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(40,50,40,0.08)] hover:border-[#CCD5C3] transition-all duration-200 ease-out flex flex-col justify-between group overflow-hidden">
      <div>
        {/* Card Header: Company, Duration, Status */}
        <div className="bg-[#F8F9F5] border-b border-[#E4E8DE] p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#2D3B2D] text-[#F4F6F1] font-semibold text-xs flex items-center justify-center shrink-0">
              {companyInitial}
            </div>
            <span className="text-xs font-semibold text-[#1B241B] truncate">
              {company}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeColor}`}
            >
              <Clock className="w-3 h-3" />
              {durationUpper}
            </span>

            {task.status === 'open' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]">
                Open
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F2F4EE] text-[#525E50] border border-[#DEE3D7]">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Task Title */}
          <Link href={`/tasks/${task._id}`}>
            <h3 className="text-base font-semibold tracking-tight text-[#1B241B] group-hover:text-[#3E5239] transition-colors line-clamp-1 mb-2">
              {task.title}
            </h3>
          </Link>

          {/* Task Description */}
          <p className="text-xs sm:text-sm text-[#525E50] line-clamp-2 mb-4 leading-relaxed font-normal">
            {task.description}
          </p>

          {/* Clean Skill Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {task.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="font-mono text-xs bg-[#F2F4EE] text-[#414E3F] px-2 py-0.5 rounded border border-[#DEE3D7]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3.5 border-t border-[#E4E8DE] flex items-center justify-between">
        <div className="text-xs font-medium text-[#525E50] flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#3E5239]" />
          <span className="text-[11px]">Verified Credential</span>
        </div>

        <Link
          href={`/tasks/${task._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#3E5239] hover:text-[#2D3B2D] shrink-0 group/btn"
        >
          <span>Inspect Task</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
