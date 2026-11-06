// Subtle Web Audio API tactile feedback for SkillTish Enterprise

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('skilltish_sound_muted') === 'true';
}

export function setMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('skilltish_sound_muted', muted ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('skilltish-sound-change', { detail: { muted } }));
}

export function toggleMute(): boolean {
  const next = !isMuted();
  setMuted(next);
  return next;
}

/**
 * Clean, subtle enterprise click feedback
 */
export function playClickSound(): void {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.03);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Elegant harmonic confirmation chime for credential approvals
 */
export function playBadgeMintSound(): void {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      const startTime = now + idx * 0.05;
      const duration = 0.45;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.04, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Ignore audio errors
  }
}
