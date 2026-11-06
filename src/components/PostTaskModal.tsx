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
  FileText,
  ListChecks,
  Building,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { playClickSound } from '@/lib/sounds';

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
  const [stipendOrPerks, setStipendOrPerks] = useState(
    '₹2,000 + Verified Skill Badge'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Close on ESC
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

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (
      !selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())
    ) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter(
        (s) => s.toLowerCase() !== skillToRemove.toLowerCase()
      )
    );
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setError(null);

    if (!title.trim()) {
      setError('Task Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Task Description is required.');
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
        throw new Error(data.error || 'Failed to publish challenge.');
      }

      setSuccessMessage('[PUBLISHED] Challenge published successfully to opportunity backlog!');

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#1B241B]/30 animate-in fade-in duration-150 overflow-y-auto font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#FBFBF9] rounded-2xl max-w-2xl w-full p-6 sm:p-7 border border-[#E4E8DE] shadow-[0_4px_20px_rgba(40,50,40,0.08)] relative my-8 max-h-[90vh] overflow-y-auto text-[#1B241B]">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#525E50] hover:text-[#1B241B] hover:bg-[#EEF2EB] transition disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {successMessage ? (
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2EB] border border-[#D5DEC9] text-[#374B35] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <span className="text-xs font-medium text-[#374B35] bg-[#EEF2EB] border border-[#D5DEC9] px-2.5 py-0.5 rounded-full">
                Challenge Published
              </span>
              <h3 className="text-xl font-bold text-[#1B241B] tracking-tight pt-2">
                Challenge Published to Backlog
              </h3>
              <p className="text-xs text-[#525E50] leading-relaxed font-normal">
                Your project challenge is now active in the backlog feed and ready for engineer deliverables.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9] mb-2">
                <Building className="w-3.5 h-3.5 text-[#3E5239]" />
                <span>Startup Backlog</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1B241B] tracking-tight">
                Post a Project Challenge
              </h2>
              <p className="text-xs text-[#525E50] mt-1 font-normal">
                Publish a scoped 1 to 14 day challenge. Developers submit authentic pull requests to earn credentials.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-medium text-[#1B241B] mb-1.5">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="e.g. Build Edge Authentication Flow with NextAuth & MongoDB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#E4E8DE] bg-white text-[#1B241B] placeholder:text-[#889684] focus:outline-none focus:ring-2 focus:ring-[#3E5239] focus:border-transparent transition"
                />
              </div>

              {/* Duration Segmented Picker */}
              <div>
                <label className="block text-xs font-medium text-[#1B241B] mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#889684]" />
                  <span>Challenge Duration *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DURATION_OPTIONS.map((opt) => {
                    const active = duration === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setDuration(opt);
                        }}
                        className={`py-1.5 px-3 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                          active
                            ? 'bg-[#344434] text-[#F4F6F1] border-[#344434] shadow-sm'
                            : 'bg-white text-[#525E50] border-[#E4E8DE] hover:bg-[#EEF2EB]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-medium text-[#1B241B] mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#889684]" />
                  <span>Required Skills &amp; Stack *</span>
                </label>

                <div className="flex flex-wrap items-center gap-1.5 mb-2 min-h-[40px] p-2 rounded-lg bg-[#F2F4EE]/50 border border-[#E4E8DE]">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#EEF2EB] text-[#374B35] border border-[#D5DEC9]"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-[#1B241B] text-[#525E50] transition ml-0.5 cursor-pointer"
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
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-[#1B241B] placeholder:text-[#889684] focus:outline-none px-1.5 py-1"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#525E50]">
                  <span className="font-medium text-[11px] text-[#889684]">Suggestions:</span>
                  {QUICK_SKILL_SUGGESTIONS.map((skill) => {
                    const isSelected = selectedSkills.some(
                      (s) => s.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          if (isSelected) {
                            handleRemoveSkill(skill);
                          } else {
                            handleAddSkill(skill);
                          }
                        }}
                        className={`px-2.5 py-0.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#344434] text-[#F4F6F1] border-[#344434]'
                            : 'bg-white text-[#525E50] border-[#E4E8DE] hover:bg-[#EEF2EB]'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-[#1B241B] mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#889684]" />
                  <span>Challenge Description &amp; Context *</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the problem statement, repository setup instructions, and expected deliverable..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg border border-[#E4E8DE] bg-white text-[#1B241B] placeholder:text-[#889684] focus:outline-none focus:ring-2 focus:ring-[#3E5239] focus:border-transparent transition resize-none"
                />
              </div>

              {/* Acceptance Criteria */}
              <div>
                <label className="block text-xs font-medium text-[#1B241B] mb-1.5 flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-[#889684]" />
                  <span>Acceptance Criteria (One per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  className="w-full p-3 text-xs rounded-lg border border-[#E4E8DE] bg-white text-[#1B241B] placeholder:text-[#889684] focus:outline-none focus:ring-2 focus:ring-[#3E5239] focus:border-transparent transition resize-none font-mono text-[11px]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E4E8DE] hover:bg-[#EEF2EB] text-[#525E50] text-xs font-medium transition cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-[#344434] hover:bg-[#283528] disabled:bg-[#D5DEC9] disabled:opacity-50 text-[#F4F6F1] font-medium text-xs shadow-sm active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F4F6F1]" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish Challenge</span>
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
