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
  Flame,
} from 'lucide-react';

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

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAllTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Client-side filtering across duration, skill, and search
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
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
        const skills = (task.skillsRequired || []).map((s: string) => s.toLowerCase());
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
        const skillMatch = (task.skillsRequired || []).some((s: string) =>
          s.toLowerCase().includes(q)
        );
        if (!titleMatch && !descMatch && !companyMatch && !skillMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allTasks, selectedDuration, selectedSkill, search]);

  const openTasksCount = allTasks.filter((t) => t.status === 'open').length;

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] bg-[#09090b] text-zinc-100">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Sprints</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Live Startup <span className="gradient-text">Backlog</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                {openTasksCount} tasks open for verification
              </span>
              <span className="text-zinc-600">•</span>
              <span>Submit code or Figma deliverables to mint badges</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={() => fetchTasks()}
              title="Refresh feed"
              className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-95 flex items-center gap-2 group cursor-pointer"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Post a Micro-Task</span>
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input with Glass Styling and Clear Button */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tasks by title, keywords, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-white/10 bg-black/40 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition font-normal"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Duration Filter Pills */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto shrink-0">
              <span className="text-[11px] font-mono uppercase text-zinc-500 pl-2 pr-1 flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                Sprint:
              </span>
              {DURATION_PILLS.map((duration) => {
                const isActive = selectedDuration === duration;
                return (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {duration}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Skills Pills */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Skills:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {POPULAR_SKILLS.map((skill) => {
                const isActive = selectedSkill === skill;
                return (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
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
          /* Elegant Skeleton Shimmer Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between animate-pulse space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-20 bg-white/[0.06] rounded-full" />
                    <div className="h-5 w-14 bg-white/[0.06] rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-white/[0.08] rounded-md" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-full bg-white/[0.04] rounded" />
                    <div className="h-3.5 w-5/6 bg-white/[0.04] rounded" />
                  </div>
                  <div className="flex gap-1.5 pt-2">
                    <div className="h-4 w-14 bg-white/[0.05] rounded" />
                    <div className="h-4 w-16 bg-white/[0.05] rounded" />
                    <div className="h-4 w-12 bg-white/[0.05] rounded" />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.06]" />
                    <div className="h-3.5 w-20 bg-white/[0.06] rounded" />
                  </div>
                  <div className="h-4 w-20 bg-white/[0.06] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          /* Sleek Empty State Card */
          <div className="glass-card rounded-3xl border border-dashed border-white/10 p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-zinc-400 border border-white/10 flex items-center justify-center mx-auto mb-3.5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg mb-1">No Matching Tasks Found</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
              We couldn&apos;t find any backlog tickets matching your active search or filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedDuration('All');
                setSelectedSkill('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/10 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Task Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
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
