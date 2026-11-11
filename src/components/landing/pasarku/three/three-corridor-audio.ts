export interface CorridorAudioHandle {
  unlock: () => Promise<boolean>;
  setMuted: (muted: boolean) => void;
  setActive: (active: boolean) => void;
  onStateChange: (cb: ((running: boolean) => void) | null) => void;
  playFootstep: (leftFoot: boolean) => void;
  playPickGrab: () => void;
  playBasketDrop: () => void;
  playBasketRemove: () => void;
  playRecenter: () => void;
  isAvailable: () => boolean;
  isRunning: () => boolean;
  dispose: () => void;
}

const PENTATONIC_SCALE_HZ = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
const MELODY_PATTERN = [0, 2, 3, -1, 4, 3, 2, 1, 3, 5, 4, -1, 2, 3, 0, -1];

function getAudioContextConstructor(): (new () => AudioContext) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    AudioContext?: new () => AudioContext;
    webkitAudioContext?: new () => AudioContext;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export function createCorridorAudioController(): CorridorAudioHandle {
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let sfxGain: GainNode | null = null;
  let bgmGain: GainNode | null = null;
  let sharedNoiseBuffer: AudioBuffer | null = null;
  let ambienceSource: AudioBufferSourceNode | null = null;
  let ambienceLfo: OscillatorNode | null = null;
  let melodyTimer: ReturnType<typeof setInterval> | null = null;
  let stepIndex = 0;
  let lastNoteAtMs = 0;
  let muted = false;
  let corridorActive = false;
  let disposed = false;
  let stateListener: ((running: boolean) => void) | null = null;

  const notifyState = () => {
    stateListener?.(Boolean(!disposed && ctx && ctx.state !== 'closed'));
  };

  const ensureContext = (): boolean => {
    if (disposed) return false;
    if (ctx) return true;
    const AudioCtor = getAudioContextConstructor();
    if (!AudioCtor) return false;
    try {
      ctx = new AudioCtor();
      ctx.onstatechange = () => {
        syncBgmLevel();
        notifyState();
      };
      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0.0001 : 0.95;
      masterGain.connect(ctx.destination);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.88;
      sfxGain.connect(masterGain);

      bgmGain = ctx.createGain();
      bgmGain.gain.value = 0.0001;
      bgmGain.connect(masterGain);

      const length = Math.floor(ctx.sampleRate * 3);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.95 * b2 + white * 0.048;
        data[i] = (b0 + b1 + b2 + white * 0.04) * 0.5;
      }
      sharedNoiseBuffer = buffer;
      return true;
    } catch {
      ctx = null;
      return false;
    }
  };

  const canEmitSound = (): boolean => {
    return Boolean(!disposed && !muted && corridorActive && ctx && sfxGain && ctx.state !== 'closed');
  };

  const triggerPentatonicNote = (freqHz: number) => {
    if (!ctx || !bgmGain || muted || !corridorActive || disposed || ctx.state === 'closed') return;
    try {
      const now = ctx.currentTime;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1420, now);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.115, now + 0.022);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

      const fundamental = ctx.createOscillator();
      fundamental.type = 'sine';
      fundamental.frequency.setValueAtTime(freqHz, now);

      const overtone = ctx.createOscillator();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freqHz * 2, now);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.024, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

      fundamental.connect(noteGain);
      overtone.connect(overtoneGain);
      overtoneGain.connect(noteGain);
      noteGain.connect(filter);
      filter.connect(bgmGain);

      fundamental.start(now);
      overtone.start(now);
      fundamental.stop(now + 1.55);
      overtone.stop(now + 0.7);
      lastNoteAtMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    } catch {}
  };

  const playNextMelodyStep = () => {
    if (muted || !corridorActive || !ctx || disposed || ctx.state === 'closed') return;
    const noteIdx = MELODY_PATTERN[stepIndex % MELODY_PATTERN.length];
    stepIndex = (stepIndex + 1) % MELODY_PATTERN.length;
    if (noteIdx >= 0) {
      const jitter = (Math.random() - 0.5) * 1.4;
      triggerPentatonicNote(PENTATONIC_SCALE_HZ[noteIdx] + jitter);
    } else {
      triggerPentatonicNote(PENTATONIC_SCALE_HZ[0]);
    }
  };

  const startAmbienceAndBgm = () => {
    if (!ctx || !bgmGain || !sharedNoiseBuffer || disposed) return;
    if (!ambienceSource) {
      try {
        const src = ctx.createBufferSource();
        src.buffer = sharedNoiseBuffer;
        src.loop = true;

        const chatterFilter = ctx.createBiquadFilter();
        chatterFilter.type = 'bandpass';
        chatterFilter.frequency.value = 440;
        chatterFilter.Q.value = 0.45;

        const warmthFilter = ctx.createBiquadFilter();
        warmthFilter.type = 'lowpass';
        warmthFilter.frequency.value = 1280;

        const ambGain = ctx.createGain();
        ambGain.gain.value = 0.095;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.16;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.value = 0.025;
        lfo.connect(lfoDepth);
        lfoDepth.connect(ambGain.gain);

        src.connect(chatterFilter);
        chatterFilter.connect(warmthFilter);
        warmthFilter.connect(ambGain);
        ambGain.connect(bgmGain);

        src.start();
        lfo.start();
        ambienceSource = src;
        ambienceLfo = lfo;
      } catch {}
    }

    if (!melodyTimer) {
      const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (nowMs - lastNoteAtMs > 420) {
        playNextMelodyStep();
      }
      melodyTimer = setInterval(() => {
        if (muted || !corridorActive || !ctx || disposed || ctx.state === 'closed') return;
        const noteIdx = MELODY_PATTERN[stepIndex % MELODY_PATTERN.length];
        stepIndex = (stepIndex + 1) % MELODY_PATTERN.length;
        if (noteIdx >= 0) {
          const jitter = (Math.random() - 0.5) * 1.4;
          triggerPentatonicNote(PENTATONIC_SCALE_HZ[noteIdx] + jitter);
        }
      }, 860);
    }
  };

  const syncBgmLevel = () => {
    if (!ctx || !masterGain || !bgmGain || disposed) return;
    const now = ctx.currentTime;
    const shouldPlay = !muted && corridorActive && ctx.state !== 'closed';

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now);
    masterGain.gain.linearRampToValueAtTime(muted ? 0.0001 : 0.95, now + 0.12);

    bgmGain.gain.cancelScheduledValues(now);
    bgmGain.gain.setValueAtTime(Math.max(0.0001, bgmGain.gain.value), now);
    bgmGain.gain.linearRampToValueAtTime(shouldPlay ? 1.0 : 0.0001, now + (shouldPlay ? 0.28 : 0.25));

    if (shouldPlay) {
      startAmbienceAndBgm();
    } else if (melodyTimer) {
      clearInterval(melodyTimer);
      melodyTimer = null;
    }
  };

  const unlock = async (): Promise<boolean> => {
    if (!ensureContext() || !ctx) return false;
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      syncBgmLevel();
      notifyState();
      return (ctx.state as AudioContextState) !== 'closed';
    } catch {
      return false;
    }
  };

  const setMuted = (nextMuted: boolean) => {
    muted = nextMuted;
    syncBgmLevel();
  };

  const setActive = (nextActive: boolean) => {
    corridorActive = nextActive;
    syncBgmLevel();
  };

  const playNoiseBurst = (durationSec: number, filterType: BiquadFilterType, freqStart: number, freqEnd: number, peakGain: number, q = 1.2) => {
    if (!ctx || !sfxGain || !sharedNoiseBuffer) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = sharedNoiseBuffer;
    const offset = Math.random() * Math.max(0.2, sharedNoiseBuffer.duration - durationSec - 0.1);

    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== freqStart) {
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + durationSec);
    }
    filter.Q.value = q;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(peakGain, now + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    src.connect(filter);
    filter.connect(env);
    env.connect(sfxGain);
    src.start(now, offset, durationSec + 0.02);
  };

  const playFootstep = (leftFoot: boolean) => {
    if (!canEmitSound() || !ctx || !sfxGain) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const baseHz = leftFoot ? 96 : 108;
      osc.frequency.setValueAtTime(baseHz, now);
      osc.frequency.exponentialRampToValueAtTime(46, now + 0.075);

      const thudGain = ctx.createGain();
      thudGain.gain.setValueAtTime(0.14, now);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

      osc.connect(thudGain);
      thudGain.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 0.09);

      playNoiseBurst(0.036, 'bandpass', leftFoot ? 820 : 940, 620, 0.048, 1.4);
    } catch {}
  };

  const playPickGrab = () => {
    if (!canEmitSound() || !ctx || !sfxGain) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(510, now + 0.065);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.085, now);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(env);
      env.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);

      playNoiseBurst(0.042, 'highpass', 1750, 2100, 0.04, 0.9);
    } catch {}
  };

  const playBasketDrop = () => {
    if (!canEmitSound() || !ctx || !sfxGain) return;
    try {
      const now = ctx.currentTime;
      const bodyOsc = ctx.createOscillator();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(178, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(88, now + 0.11);

      const bodyGain = ctx.createGain();
      bodyGain.gain.setValueAtTime(0.18, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.125);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(sfxGain);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.13);

      const woodOsc = ctx.createOscillator();
      woodOsc.type = 'sine';
      woodOsc.frequency.setValueAtTime(587, now + 0.015);
      const woodGain = ctx.createGain();
      woodGain.gain.setValueAtTime(0.036, now + 0.015);
      woodGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      woodOsc.connect(woodGain);
      woodGain.connect(sfxGain);
      woodOsc.start(now + 0.015);
      woodOsc.stop(now + 0.12);

      playNoiseBurst(0.038, 'bandpass', 1180, 920, 0.065, 2.6);
    } catch {}
  };

  const playBasketRemove = () => {
    if (!canEmitSound() || !ctx || !sfxGain) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(490, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.09);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.1, now);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(env);
      env.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 0.11);

      playNoiseBurst(0.045, 'bandpass', 1350, 780, 0.052, 1.8);
    } catch {}
  };

  const playRecenter = () => {
    if (!canEmitSound() || !ctx || !sfxGain) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(587, now + 0.085);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.042, now);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(env);
      env.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 0.12);

      playNoiseBurst(0.11, 'bandpass', 520, 1080, 0.045, 1.1);
    } catch {}
  };

  const dispose = () => {
    disposed = true;
    corridorActive = false;
    stateListener = null;
    if (melodyTimer) {
      clearInterval(melodyTimer);
      melodyTimer = null;
    }
    try {
      ambienceSource?.stop();
    } catch {}
    try {
      ambienceLfo?.stop();
    } catch {}
    ambienceSource = null;
    ambienceLfo = null;
    if (ctx) {
      ctx.onstatechange = null;
      ctx.close().catch(() => {});
      ctx = null;
    }
    masterGain = null;
    sfxGain = null;
    bgmGain = null;
    sharedNoiseBuffer = null;
  };

  return {
    unlock,
    setMuted,
    setActive,
    onStateChange: (cb: ((running: boolean) => void) | null) => {
      stateListener = cb;
      if (cb && ctx) {
        cb(!disposed && ctx.state !== 'closed');
      }
    },
    playFootstep,
    playPickGrab,
    playBasketDrop,
    playBasketRemove,
    playRecenter,
    isAvailable: () => getAudioContextConstructor() !== null,
    isRunning: () => Boolean(ctx && ctx.state !== 'closed'),
    dispose,
  };
}
