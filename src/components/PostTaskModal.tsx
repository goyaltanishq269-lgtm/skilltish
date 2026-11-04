'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Loader2,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  Tag,
  Coins,
  ListChecks,
  FileText,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PostTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

const DURATION_OPTIONS = ['1 day', '3 days', '1 week', '2 weeks'] as const;
const QUICK_SKILL_SUGGESTIONS = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind',
  'Figma',
  'Node.js',
  'MongoDB',
  'NextAuth',
];

export default function PostTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}: PostTaskModalProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [duration, setDuration] =
    useState<(typeof DURATION_OPTIONS)[number]>('3 days');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Next.js',
    'Tailwind',
    'TypeScript',
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    '• Fully responsive across mobile & desktop\n• Strict TypeScript typings without any `any`\n• Clean README documentation with setup steps'
  );
  const [stipendOrPerks, setStipendOrPerks] = useState('₹2,000 + Verified Skill Badge');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  // Tag helper
  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (title.trim().length > 120) {
      setError('Task title cannot exceed 120 characters.');
      return;
    }
    if (!description.trim()) {
      setError('Task description and deliverables are required.');
      return;
    }
    if (selectedSkills.length === 0) {
      setError('Please specify at least one required skill.');
      return;
    }

    setLoading(true);

    try {
      // Split acceptance criteria by newline and strip bullets
      const criteriaList = acceptanceCriteria
        .split('\n')
        .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration,
          skillsRequired: selectedSkills,
          acceptanceCriteria: criteriaList,
          stipendOrPerks: stipendOrPerks.trim() || 'Verified Skill Badge',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish micro-task.');
      }

      setSuccessMessage('🎉 Micro-Task published successfully to the opportunity feed!');

      // Reset form fields
      setTitle('');
      setDescription('');
      setAcceptanceCriteria('');
      setSelectedSkills(['Next.js', 'Tailwind', 'TypeScript']);
      setStipendOrPerks('₹2,000 + Verified Skill Badge');

      // Trigger callbacks & global event
      if (onTaskCreated) onTaskCreated();
      window.dispatchEvent(new CustomEvent('task-created', { detail: data }));
      router.refresh();

      // Close modal smoothly after brief success display
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while posting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl shadow-indigo-950/60 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Header Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          /* Full Success Confirmation State */
          <div className="py-10 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                HTTP 201 Created
              </span>
              <h3 className="text-2xl font-extrabold text-white pt-1">
                Micro-Task Published Successfully!
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your sprint is now active in the Micro-Tasks Opportunity Feed and ready for student proof-of-work submissions.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Closing window automatically...
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Company Micro-Task Creator</span>
              </div>
              <h2 id="modal-title" className="text-2xl font-extrabold text-white">
                Post a Micro-Task
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Publish a scoped 1 to 14 day sprint. Students submit authentic code or Figma deliverables to earn verified credentials.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Task Title *
              </label>
              <span
                className={`text-[11px] font-mono ${
                  title.length > 120 ? 'text-rose-400' : 'text-slate-500'
                }`}
              >
                {title.length}/120
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Build Dark Mode Mobile Drawer in Tailwind"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* 2. Duration Pill Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sprint Duration *</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((opt) => {
                const active = duration === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDuration(opt)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Required Skills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Required Skills *</span>
            </label>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5 min-h-[32px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-400 text-slate-400 transition ml-0.5"
                    aria-label={`Remove skill ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                placeholder="Type skill & press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDownSkill}
                className="flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-1.5 py-1"
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
              <span className="font-medium text-slate-500">Suggestions:</span>
              {QUICK_SKILL_SUGGESTIONS.map((skill) => {
                const isSelected = selectedSkills.some(
                  (s) => s.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleRemoveSkill(skill);
                      } else {
                        handleAddSkill(skill);
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md border text-[11px] transition ${
                      isSelected
                        ? 'bg-indigo-600/40 border-indigo-500 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    + {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Description & Deliverables */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Description & Deliverables *</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain the background, key technical requirements, and the expected deliverable (e.g. GitHub Pull Request or Figma Prototype link)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none leading-relaxed"
            />
          </div>

          {/* 5. Acceptance Criteria */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                <span>Acceptance Criteria (One per line)</span>
              </label>
              <span className="text-[11px] text-slate-500">Split by newline</span>
            </div>
            <textarea
              rows={3}
              placeholder="• Responsive mobile-first design&#10;• Zero TypeScript errors&#10;• Includes unit tests or live preview"
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none leading-relaxed"
            />
          </div>

          {/* 6. Stipend or Perks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stipend & Reward</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ₹2,000 + Verified Skill Badge"
              value={stipendOrPerks}
              onChange={(e) => setStipendOrPerks(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Students also receive an authenticated verified skill credential minted directly to their portfolio.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Task...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish Micro-Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </>
    )}
  </div>
</div>
  );
}
