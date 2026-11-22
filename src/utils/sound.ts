// Lightweight playful Web Audio API sound effects for kids (no external assets required)

class SoundManager {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', delay = 0, gainVal = 0.12) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playTap() {
    this.playTone(540, 0.07, 'sine', 0, 0.08);
  }

  playCorrect() {
    this.playTone(523.25, 0.12, 'triangle', 0, 0.14); // C5
    this.playTone(659.25, 0.12, 'triangle', 0.09, 0.14); // E5
    this.playTone(783.99, 0.22, 'triangle', 0.18, 0.16); // G5
  }

  playWrong() {
    this.playTone(320, 0.14, 'sine', 0, 0.1);
    this.playTone(260, 0.2, 'sine', 0.12, 0.1);
  }

  playWin() {
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.18, 'triangle', idx * 0.09, 0.14);
    });
  }
}

export const soundFX = new SoundManager();
