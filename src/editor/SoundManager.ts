/**
 * SoundManager - Generates short sound effects using the Web Audio API.
 *
 * All sounds are synthesized on-the-fly with oscillator nodes (no external
 * audio files required). The AudioContext is lazily initialized on the first
 * call to any sound method, satisfying the browser requirement that an
 * AudioContext be created/resumed inside a user-gesture handler.
 */
class SoundManager {
  private ctx: AudioContext | null = null;

  /** Lazily create (or resume) the AudioContext. */
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Schedule a single oscillator tone.
   *
   * @param frequency  Tone frequency in Hz.
   * @param startTime  AudioContext time at which the tone begins.
   * @param duration   Length of the tone in seconds.
   * @param type       OscillatorType (sine, square, sawtooth, triangle).
   * @param gain       Peak gain value (volume).
   * @param fadeOut     Duration of the exponential fade-out in seconds
   *                    (defaults to 80 % of the tone duration).
   */
  private playTone(
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    fadeOut?: number,
  ): void {
    const ctx = this.ensureContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(gain, startTime);

    const fadeDuration = fadeOut ?? duration * 0.8;
    const fadeStart = startTime + duration - fadeDuration;
    gainNode.gain.setValueAtTime(gain, fadeStart);
    // exponentialRampToValueAtTime cannot ramp to 0; use a very small value.
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    // Self-disconnect after the tone has finished to free resources.
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  // ---------------------------------------------------------------------------
  // Public sound effects
  // ---------------------------------------------------------------------------

  /**
   * Short click sound – a very brief high-frequency square-wave pulse.
   * Used when a wire is connected.
   */
  wireConnect(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    this.playTone(1200, now, 0.05, "square", 0.15, 0.04);
  }

  /**
   * Soft thud – a short low-frequency sine wave with a quick decay.
   * Used when a gate is placed on the canvas.
   */
  gatePlace(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    this.playTone(150, now, 0.08, "sine", 0.3, 0.07);
  }

  /**
   * Pleasant ascending chime – three quick ascending notes (C5, E5, G5).
   * Used when a verification / test run passes.
   */
  verifySuccess(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    const notes = [523, 659, 784]; // C5, E5, G5
    const noteDuration = 0.1; // 100 ms each

    notes.forEach((freq, i) => {
      this.playTone(freq, now + i * noteDuration, noteDuration, "sine", 0.2);
    });
  }

  /**
   * Low buzz – a short sawtooth wave at a low frequency.
   * Used when a verification / test run fails.
   */
  verifyFail(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    this.playTone(100, now, 0.2, "sawtooth", 0.2, 0.15);
  }

  /**
   * Victory fanfare – a short ascending melody (C5, E5, G5, C6) with slight
   * overlap between notes. Used when a level is completed.
   */
  levelComplete(): void {
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    const noteDuration = 0.15; // 150 ms each
    const noteSpacing = 0.12; // slight overlap (150 - 120 = 30 ms overlap)

    notes.forEach((freq, i) => {
      this.playTone(
        freq,
        now + i * noteSpacing,
        noteDuration,
        "sine",
        0.25,
      );
    });
  }
}

export const soundManager = new SoundManager();
