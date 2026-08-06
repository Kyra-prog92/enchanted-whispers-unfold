import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Procedural fantasy-orchestra engine (Web Audio): slow evolving string/choir pad,
 * a solo piano-ish voice, wind, and distant bells. Each chapter has its own chord
 * colour, and chapters crossfade into one another.
 */
const CHAPTER_CHORDS: number[][] = [
  [110, 164.81, 220, 329.63], // gates — A minor open
  [98, 146.83, 196, 293.66], // library — G
  [130.81, 196, 261.63, 392], // garden — C
  [116.54, 174.61, 233.08, 349.23], // wishing tree — Bb
  [87.31, 130.81, 174.61, 261.63], // promise — F
  [82.41, 123.47, 164.81, 246.94], // forever — E
];

export function useOrchestra() {
  const [enabled, setEnabled] = useState(false);
  const [chapter, setChapter] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voicesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const timersRef = useRef<number[]>([]);

  const stop = useCallback(() => {
    timersRef.current.forEach((id) => window.clearInterval(id));
    timersRef.current = [];
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.4);
    }
    window.setTimeout(() => {
      voicesRef.current.forEach((v) => {
        try {
          v.osc.stop();
        } catch {
          /* already stopped */
        }
      });
      voicesRef.current = [];
      ctxRef.current?.close();
      ctxRef.current = null;
      masterRef.current = null;
    }, 1600);
  }, []);

  const start = useCallback(() => {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const reverbish = ctx.createBiquadFilter();
    reverbish.type = "lowpass";
    reverbish.frequency.value = 1800;
    master.connect(reverbish).connect(ctx.destination);
    masterRef.current = master;
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 6);

    // Pad voices (strings + choir)
    const chord = CHAPTER_CHORDS[0]!;
    chord.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      const det = ctx.createOscillator();
      det.type = "sine";
      det.frequency.value = 0.12 + i * 0.05;
      const detGain = ctx.createGain();
      detGain.gain.value = 1.6;
      det.connect(detGain).connect(osc.frequency);
      const gain = ctx.createGain();
      gain.gain.value = 0.16 / (i + 1);
      osc.connect(gain).connect(master);
      osc.start();
      det.start();
      voicesRef.current.push({ osc, gain });
    });

    // Wind
    const noiseLen = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) data[i] = (Math.random() * 2 - 1) * 0.32;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 480;
    bp.Q.value = 0.6;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain).connect(noiseGain.gain);
    noise.connect(bp).connect(noiseGain).connect(master);
    noise.start();
    lfo.start();

    // Piano-ish melody notes + distant bells
    const pluck = (freq: number, dur = 3.4, type: OscillatorType = "sine", vol = 0.1) => {
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g).connect(master);
      o.start(now);
      o.stop(now + dur + 0.1);
    };

    timersRef.current.push(
      window.setInterval(() => {
        const c = CHAPTER_CHORDS[chapterRef.current] ?? CHAPTER_CHORDS[0]!;
        const note = c[Math.floor(Math.random() * c.length)]! * (Math.random() < 0.5 ? 2 : 4);
        pluck(note, 3.2 + Math.random() * 2, "sine", 0.075);
      }, 4200),
    );
    timersRef.current.push(
      window.setInterval(() => {
        if (Math.random() < 0.45) pluck(523.25, 6.5, "triangle", 0.05);
      }, 15000),
    );
  }, []);

  const chapterRef = useRef(0);
  useEffect(() => {
    chapterRef.current = chapter;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const chord = CHAPTER_CHORDS[chapter] ?? CHAPTER_CHORDS[0]!;
    voicesRef.current.forEach((v, i) => {
      const f = chord[i % chord.length]!;
      v.osc.frequency.cancelScheduledValues(ctx.currentTime);
      v.osc.frequency.linearRampToValueAtTime(f, ctx.currentTime + 4.5);
    });
  }, [chapter]);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      if (on) stop();
      else start();
      return !on;
    });
  }, [start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { enabled, toggle, setChapter };
}