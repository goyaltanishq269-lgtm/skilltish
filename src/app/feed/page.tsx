'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  RefreshCw,
  Building,
} from 'lucide-react';

const DURATION_OPTIONS = ['all', '1 day', '3 days', '1 week', '2 weeks'];
const POPULAR_SKILLS = [
  'all',
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
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDuration !== 'all') params.set('duration', selectedDuration);
      if (selectedSkill !== 'all') params.set('skill', selectedSkill);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDuration, selectedSkill, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Sprints</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Micro-Task Opportunities
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete scoped sprints, submit proof of work, and earn verified skill badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTasks()}
            title="Refresh feed"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>Post a Micro-Task</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks by title, description, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium text-slate-700"
            >
              <option value="all">All Durations (1 day - 2 weeks)</option>
              <option value="1 day">1 day (Rapid Sprint)</option>
              <option value="3 days">3 days (Weekend Sprint)</option>
              <option value="1 week">1 week (Feature Sprint)</option>
              <option value="2 weeks">2 weeks (Deep Sprint)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Skills:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {POPULAR_SKILLS.map((skill) => {
              const active = selectedSkill === skill;
              return (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {skill === 'all' ? 'All Skills' : skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading opportunity feed...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">No Micro-Tasks Found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Try adjusting your search terms, duration filters, or post a new sprint task.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedDuration('all');
              setSelectedSkill('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}

      <PostTaskModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onTaskCreated={() => {
          fetchTasks();
        }}
      />
    </div>
  );
}
