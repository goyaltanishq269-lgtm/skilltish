// Web Audio API tactile sound generator for SkillTish

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
 * Short, crisp mechanical frequency pop (120Hz -> 80Hz exponentially decayed in 0.05s)
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
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.045);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

/**
 * Rewarding harmonic chime chord (C5 + E5 + G5 with gentle exponential decay over 0.6s)
 */
export function playBadgeMintSound(): void {
  if (isMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Frequencies for C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const frequencies = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      // Staggered bell-like decay
      const startTime = now + idx * 0.04;
      const duration = 0.55;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.02);
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
