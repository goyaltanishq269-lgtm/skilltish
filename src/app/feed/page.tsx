'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import TaskCard from '@/components/TaskCard';
import PostTaskModal from '@/components/PostTaskModal';
import {
  Search,
  Filter,
  Plus,
  Clock,
  Sparkles,
  Layers,
  RefreshCw,
  X,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

const DURATION_PILLS = ['All', '1-3 Days', '1 Week', '2 Weeks'];

const POPULAR_SKILLS = [
  'All',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Next.js',
  'Figma',
  'Node.js',
  'NextAuth',
];

export default function FeedPage() {
  const { data: session } = useSession();
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [verifiedToast, setVerifiedToast] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('verified') === 'true') {
        setVerifiedToast(true);
      }
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error(`Failed to fetch tasks: HTTP ${res.status}`);
      }
      const data = await res.json();
      setAllTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch tasks, falling back to empty list:', err);
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side filtering across duration, skill, and search
  const filteredTasks = useMemo(() => {
    return (allTasks ?? []).filter((task) => {
      if (!task) return false;

      // 1. Duration filter
      if (selectedDuration === '1-3 Days') {
        const d = (task.duration || '').toLowerCase();
        if (d !== '1 day' && d !== '3 days') return false;
      } else if (selectedDuration === '1 Week') {
        const d = (task.duration || '').toLowerCase();
        if (d !== '1 week') return false;
      } else if (selectedDuration === '2 Weeks') {
        const d = (task.duration || '').toLowerCase();
        if (d !== '2 weeks') return false;
      }

      // 2. Skill filter
      if (selectedSkill !== 'All') {
        const skills = (task.skillsRequired ?? []).map((s: string) => s.toLowerCase());
        if (!skills.some((s: string) => s.includes(selectedSkill.toLowerCase()))) {
          return false;
        }
      }

      // 3. Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const titleMatch = (task.title || '').toLowerCase().includes(q);
        const descMatch = (task.description || '').toLowerCase().includes(q);
        const companyMatch = (task.companyName || task.posterName || '').toLowerCase().includes(q);
        const skillMatch = (task.skillsRequired ?? []).some((s: string) =>
          s.toLowerCase().includes(q)
        );
        if (!titleMatch && !descMatch && !companyMatch && !skillMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allTasks, selectedDuration, selectedSkill, search]);

  const openTasksCount = (allTasks ?? []).filter((t) => t?.status === 'open').length;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FBFBF9] text-[#1B241B]">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Verification Success Toast */}
        {verifiedToast && (
          <div className="mb-6 p-4 rounded-xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] text-xs sm:text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#3E5239] shrink-0" />
              <span>Email verified successfully. You have full access to project challenges, submissions, and credentials.</span>
            </div>
            <button
              onClick={() => setVerifiedToast(false)}
              className="text-[#374B35] hover:text-[#1B241B] text-xs font-semibold ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2.5">
              <Building className="w-3.5 h-3.5 text-[#3E5239]" />
              <span>Enterprise Backlog</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1B241B] tracking-tight">
              Production Project Challenges
            </h1>

            <p className="text-xs sm:text-sm text-[#525E50] mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#374B35]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {openTasksCount} challenges open for verification
              </span>
              <span className="text-[#D5DEC9]">•</span>
              <span>Submit code pull requests to earn verified skill credentials</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={() => {
                playClickSound();
                fetchTasks();
              }}
              title="Refresh feed"
              className="p-2.5 rounded-lg bg-white border border-[#D5DEC9] hover:bg-[#F4F6F1] text-[#525E50] hover:text-[#1B241B] transition shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {session?.user?.role === 'company' && (
              <button
                onClick={() => {
                  playClickSound();
                  setIsPostModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#344434] hover:bg-[#283528] text-[#F4F6F1] shadow-sm active:scale-[0.98] transition-transform font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Challenge</span>
              </button>
            )}
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-[#E4E8DE] shadow-[0_1px_3px_rgba(40,50,40,0.04),0_6px_16px_rgba(40,50,40,0.02)] mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#525E50]" />
              <input
                type="text"
                placeholder="Search challenges by title, keywords, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-lg border border-[#E4E8DE] bg-[#F8F9F5] text-[#1B241B] placeholder-[#525E50]/60 focus:outline-none focus:ring-2 focus:ring-[#3E5239] focus:bg-white focus:border-transparent transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525E50] hover:text-[#1B241B] transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Duration Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#F2F4EE] p-1 rounded-lg border border-[#DEE3D7] overflow-x-auto shrink-0">
              <span className="text-[11px] font-medium text-[#525E50] pl-2 pr-1 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 text-[#3E5239]" />
                Duration:
              </span>
              {DURATION_PILLS.map((duration) => {
                const isActive = selectedDuration === duration;
                return (
                  <button
                    key={duration}
                    onClick={() => {
                      playClickSound();
                      setSelectedDuration(duration);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#2D3B2D] shadow-sm font-semibold border border-[#D5DEC9]'
                        : 'text-[#525E50] hover:text-[#1B241B] hover:bg-[#E4E8DE]'
                    }`}
                  >
                    {duration}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Skills Pills */}
          <div className="pt-3 border-t border-[#E4E8DE] flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-medium text-[#525E50] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#3E5239]" />
              Stack:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {POPULAR_SKILLS.map((skill) => {
                const isActive = selectedSkill === skill;
                return (
                  <button
                    key={skill}
                    onClick={() => {
                      playClickSound();
                      setSelectedSkill(skill);
                    }}
                    className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-[#344434] text-[#F4F6F1] shadow-sm'
                        : 'bg-[#F2F4EE] text-[#414E3F] hover:text-[#1B241B] hover:bg-[#E4E8DE] border border-[#DEE3D7]'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FEED CONTENT: SKELETON / EMPTY / TASK CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white/80 rounded-xl p-6 border border-[#E4E8DE] shadow-sm flex flex-col justify-between animate-pulse space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 bg-[#F2F4EE] rounded-full" />
                    <div className="h-5 w-14 bg-[#F2F4EE] rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-[#E4E8DE] rounded-md" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full bg-[#F2F4EE] rounded" />
                    <div className="h-3.5 w-5/6 bg-[#F2F4EE] rounded" />
                  </div>
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-4 w-14 bg-[#F2F4EE] rounded" />
                    <div className="h-4 w-16 bg-[#F2F4EE] rounded" />
                    <div className="h-4 w-12 bg-[#F2F4EE] rounded" />
                  </div>
                </div>
                <div className="pt-4 border-t border-[#E4E8DE] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F2F4EE]" />
                    <div className="h-3.5 w-20 bg-[#F2F4EE] rounded" />
                  </div>
                  <div className="h-4 w-20 bg-[#F2F4EE] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white/90 rounded-2xl border border-dashed border-[#CCD5C3] p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#EEF2EB] text-[#374B35] flex items-center justify-center mx-auto mb-3.5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#1B241B] text-lg mb-1">
              No Matching Challenges Found
            </h3>
            <p className="text-xs sm:text-sm text-[#525E50] mb-6 max-w-sm mx-auto font-normal">
              We couldn&apos;t find any backlog tickets matching your active search or filters.
            </p>
            <button
              onClick={() => {
                playClickSound();
                setSearch('');
                setSelectedDuration('All');
                setSelectedSkill('All');
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-[#EEF2EB] hover:bg-[#D5DEC9] text-[#374B35] transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredTasks ?? []).map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}

        {/* Post Task Modal */}
        <PostTaskModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onTaskCreated={() => {
            fetchTasks();
          }}
        />
      </div>
    </div>
  );
}
