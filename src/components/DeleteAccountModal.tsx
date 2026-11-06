'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { AlertTriangle, Loader2, X, Trash2 } from 'lucide-react';
import { playClickSound } from '@/lib/sounds';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userEmail,
}: DeleteAccountModalProps) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfirmationInput('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Handle ESC key
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

  const isConfirmed = confirmationInput.trim() === 'DELETE';

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || loading) return;

    playClickSound();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete account. Please try again.');
      }

      // Successfully deleted: clear session and redirect to homepage
      await signOut({ callbackUrl: '/' });
    } catch (err: any) {
      console.error('Account deletion error:', err);
      setError(err?.message || 'Failed to delete account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#1B241B]/30 animate-in fade-in duration-150 font-sans">
      <div className="relative w-full max-w-md bg-[#FBFBF9] rounded-2xl border border-[#E4E8DE] shadow-[0_4px_24px_rgba(40,50,40,0.08)] overflow-hidden text-[#1B241B]">
        {/* Top Header */}
        <div className="px-6 pt-5 pb-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100/80 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                Delete Account
              </h3>
              <p className="text-[11px] text-rose-700 font-medium">
                Irreversible safety confirmation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-[#525E50] hover:text-[#1B241B] hover:bg-[#EEF2EB] transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleDelete} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 text-xs text-[#525E50] leading-relaxed">
            <p>
              This will permanently delete your SkillTish account
              {userEmail ? <strong className="text-[#1B241B] font-semibold"> ({userEmail})</strong> : ''},
              including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#525E50]">
              <li>All verified skill credentials and cryptographic badges</li>
              <li>Active task submissions, deliverable links, and reviewer notes</li>
              <li>Any posted project challenges and engineering backlogs</li>
              <li>Authentication profile and session credentials</li>
            </ul>
            <p className="text-rose-600 font-medium pt-1">
              This action cannot be undone. You will be signed out immediately.
            </p>
          </div>

          {/* Double-confirmation Prompt */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-[#1B241B] mb-1.5">
              To confirm, type <span className="bg-rose-50 px-1.5 py-0.5 border border-rose-200 rounded text-rose-700 font-semibold font-mono text-[11px]">DELETE</span> below:
            </label>
            <input
              type="text"
              required
              autoFocus
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="DELETE"
              disabled={loading}
              className="w-full px-3.5 py-2 rounded-lg border border-[#E4E8DE] bg-white text-[#1B241B] placeholder:text-[#889684] text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white border border-[#E4E8DE] hover:bg-[#EEF2EB] text-[#525E50] text-xs font-medium transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isConfirmed || loading}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-[#EEF2EB] disabled:text-[#889684] disabled:cursor-not-allowed text-white text-xs font-medium shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
