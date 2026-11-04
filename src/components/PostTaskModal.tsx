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
  'Tailwind CSS',
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
    'Tailwind CSS',
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
      setSelectedSkills(['Next.js', 'Tailwind CSS', 'TypeScript']);
      setStipendOrPerks('₹2,000 + Verified Skill Badge');

      if (onTaskCreated) onTaskCreated();
      window.dispatchEvent(new CustomEvent('task-created', { detail: data }));
      router.refresh();

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-white/10 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto bg-[#0d0d12]/95 backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          /* Full Success Confirmation */
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
                HTTP 201 Created
              </span>
              <h3 className="text-2xl font-extrabold text-white pt-1">
                Micro-Task Published Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Your sprint is now active in the Micro-Tasks Opportunity Feed and ready for student deliverables.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs text-zinc-400 flex items-center justify-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Closing modal automatically...
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Company Task Creator</span>
              </div>
              <h2 id="modal-title" className="text-2xl font-extrabold text-white tracking-tight">
                Post a Micro-Task
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Publish a scoped 1 to 14 day sprint. Students submit authentic code or Figma deliverables to earn verified credentials.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 1. Task Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                    Task Title *
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      title.length > 120 ? 'text-rose-400' : 'text-zinc-500'
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
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition font-normal"
                />
              </div>

              {/* 2. Duration Segmented Picker Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 font-mono flex items-center gap-1.5">
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
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer font-mono ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                            : 'bg-black/40 text-zinc-400 border-white/10 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Required Skills & Suggestions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 font-mono flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Required Skills *</span>
                </label>

                {/* Selected Skills Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5 min-h-[36px] p-2 rounded-xl bg-black/40 border border-white/10">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400 text-zinc-400 transition ml-0.5"
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
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none px-1.5 py-1"
                  />
                </div>

                {/* Quick Suggestions Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className="font-mono text-zinc-500">Suggestions:</span>
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
                        className={`px-2 py-0.5 rounded-md border text-[11px] transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/40 border-indigo-500 text-indigo-200'
                            : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200'
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
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Description &amp; Deliverables *</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the background, key technical requirements, and the expected deliverable (e.g. GitHub Pull Request or Figma Prototype link)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition resize-none leading-relaxed font-normal"
                />
              </div>

              {/* 5. Acceptance Criteria */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Acceptance Criteria (One per line)</span>
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">Split by newline</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="• Responsive mobile-first design&#10;• Zero TypeScript errors&#10;• Includes unit tests or live preview"
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-black/40 border border-white/10 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition resize-none leading-relaxed"
                />
              </div>

              {/* 6. Stipend or Perks */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 font-mono flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Stipend &amp; Reward</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹2,000 + Verified Skill Badge"
                  value={stipendOrPerks}
                  onChange={(e) => setStipendOrPerks(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition font-normal"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Students also receive an authenticated verified skill credential minted directly to their portfolio.
                </p>
              </div>

              {/* Form Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] text-xs sm:text-sm font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
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
