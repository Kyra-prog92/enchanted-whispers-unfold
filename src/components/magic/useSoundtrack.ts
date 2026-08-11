import { useCallback, useEffect, useRef, useState } from "react";
import song from "@/assets/song.mp3.asset.json";

const TARGET_VOLUME = 0.55;

/** The kingdom's theme song — looping, with a slow cinematic fade in and out. */
const PREF_KEY = "ewu:sound";

export function useSoundtrack() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const fadeTo = useCallback((target: number, done?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    fadeRef.current = window.setInterval(() => {
      const diff = target - el.volume;
      if (Math.abs(diff) < 0.02) {
        el.volume = target;
        if (fadeRef.current) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        done?.();
        return;
      }
      el.volume = Math.min(Math.max(el.volume + Math.sign(diff) * 0.02, 0), 1);
    }, 90);
  }, []);

  const play = useCallback(() => {
    let el = audioRef.current;
    if (!el) {
      el = new Audio(song.url);
      el.loop = true;
      el.preload = "auto";
      audioRef.current = el;
    }
    el.volume = 0;
    void el.play().catch(() => undefined);
    fadeTo(TARGET_VOLUME);
  }, [fadeTo]);

  const pause = useCallback(() => {
    fadeTo(0, () => audioRef.current?.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      if (on) pause();
      else play();
      return !on;
    });
  }, [pause, play]);

  // Remember the visitor's choice for the rest of the session (never across visits,
  // and never used to autoplay before a gesture).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(PREF_KEY, enabled ? "on" : "off");
    } catch {
      /* private mode — the preference simply isn't remembered */
    }
  }, [enabled]);

  useEffect(
    () => () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current);
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  /** The stored preference, for deciding whether a gesture should start the music. */
  const preferred = (() => {
    if (typeof window === "undefined") return null;
    try {
      return window.sessionStorage.getItem(PREF_KEY);
    } catch {
      return null;
    }
  })();

  return { enabled, toggle, preferred };
}
