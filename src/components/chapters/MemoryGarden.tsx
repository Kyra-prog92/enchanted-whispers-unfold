import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Scene } from "@/components/magic/Scene";
import { ParticleField } from "@/components/magic/ParticleField";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { MemoryMoment } from "@/components/magic/MemoryMoment";
import { usePrefersReducedMotion } from "@/components/magic/usePrefersReducedMotion";
import { GARDEN_MEMORIES as MEMORIES } from "@/story/memories";
import garden from "@/assets/garden.jpg";

const pad = (n: number) => String(n).padStart(2, "0");
/** How long a memory holds the screen when the film runs itself. */
const HOLD_MS = 9000;
/** Length of the cut, matched to the memory-in / memory-out keyframes. */
const CUT_MS = 900;

/**
 * The memories play as a cinematic film — one frame at a time, joined by film
 * edits rather than by clicks. The leaving memory drifts away under a breath of
 * blur while the next one emerges; the controls stay quiet at the edges.
 */
export function MemoryGarden({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [immersive, setImmersive] = useState(false);
  const [auto, setAuto] = useState(false);
  const touchX = useRef<number | null>(null);
  const cut = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    const target = ((next % MEMORIES.length) + MEMORIES.length) % MEMORIES.length;
    setI((current) => {
      if (target === current) return current;
      setDir(target > current || (current === MEMORIES.length - 1 && target === 0) ? 1 : -1);
      setLeaving(current);
      if (cut.current) clearTimeout(cut.current);
      cut.current = setTimeout(() => setLeaving(null), CUT_MS);
      return target;
    });
  }, []);

  useEffect(() => () => (cut.current ? clearTimeout(cut.current) : undefined), []);

  const m = MEMORIES[i]!;
  const out = leaving != null ? MEMORIES[leaving] : undefined;
  const last = i === MEMORIES.length - 1;

  // The film runs itself only when asked, and never against reduced motion.
  useEffect(() => {
    if (!auto || reduced) return;
    if (last) {
      setAuto(false);
      return;
    }
    const t = setTimeout(() => go(i + 1), HOLD_MS);
    return () => clearTimeout(t);
  }, [auto, reduced, i, last, go]);

  // While immersed, the arrows belong to the memories, not to the chapters.
  useEffect(() => {
    if (!immersive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
      }
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "Escape") setImmersive(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [immersive, go, i]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const start = touchX.current;
      const end = e.changedTouches[0]?.clientX ?? null;
      touchX.current = null;
      if (start == null || end == null) return;
      const dx = end - start;
      if (Math.abs(dx) < 48) return;
      setAuto(false);
      go(dx < 0 ? i + 1 : i - 1);
    },
  };

  /** The cinematic stage: layered frames, so a cut always has two images. */
  const stage = (fullscreen: boolean) => (
    <div
      className={`relative w-full overflow-hidden ${
        fullscreen ? "h-[72dvh] sm:h-[78dvh]" : "h-[46dvh] min-h-[16rem] sm:h-[54dvh]"
      }`}
      {...swipe}
    >
      {out ? (
        <div className="absolute inset-0">
          <MemoryMoment memory={out} exiting direction={dir} fullscreen={fullscreen} />
        </div>
      ) : null}
      <div className="absolute inset-0">
        <MemoryMoment memory={m} direction={dir} fullscreen={fullscreen} />
      </div>
      {/* A pass of moonlight across the cut. */}
      {out && !reduced ? <span key={i} aria-hidden className="film-sweep" /> : null}
    </div>
  );

  const controls = (fullscreen: boolean) => (
    <div className="mx-auto mt-4 w-full max-w-2xl">
      {/* Cinematic progress: a thin filmstrip of stops, not a navigation bar. */}
      <nav
        aria-label="Memory timeline"
        className="flex items-center justify-center gap-1 opacity-60 transition-opacity duration-500 hover:opacity-100 focus-within:opacity-100 sm:gap-2"
      >
        {MEMORIES.map((memory, k) => (
          <button
            key={memory.title}
            type="button"
            onClick={() => {
              setAuto(false);
              go(k);
            }}
            aria-current={k === i ? "step" : undefined}
            aria-label={`Memory ${k + 1}: ${memory.title}`}
            className="group flex min-h-8 flex-1 flex-col items-center gap-1.5"
          >
            <span
              className="h-px w-full transition-colors duration-700"
              style={{
                background: k <= i ? "oklch(0.85 0.14 85 / 0.7)" : "oklch(0.85 0.14 85 / 0.16)",
              }}
            />
            <span
              className="h-1.5 w-1.5 rotate-45 border transition-all duration-700"
              style={{
                borderColor: k === i ? "oklch(0.85 0.14 85 / 0.8)" : "oklch(0.85 0.14 85 / 0.35)",
                background: k === i ? "oklch(0.85 0.14 85)" : "transparent",
                boxShadow: k === i ? "var(--glow-gold)" : "none",
              }}
            />
          </button>
        ))}
      </nav>

      <div className="mt-3 flex items-center justify-center gap-3 text-[0.5rem] tracking-[0.35em] uppercase sm:gap-5">
        <button
          type="button"
          onClick={() => {
            setAuto(false);
            go(i - 1);
          }}
          aria-label="Previous memory"
          className="min-h-11 px-2 text-muted-foreground/70 transition-colors hover:text-primary focus-visible:text-primary"
        >
          ← Earlier
        </button>
        <span className="text-[0.55rem] tracking-[0.35em] text-primary/80 uppercase">
          {pad(i + 1)} / {pad(MEMORIES.length)}
        </span>
        <button
          type="button"
          onClick={() => {
            setAuto(false);
            if (last) go(0);
            else go(i + 1);
          }}
          aria-label={last ? "Walk the memories again" : "Next memory"}
          className="min-h-11 px-2 text-muted-foreground/70 transition-colors hover:text-primary focus-visible:text-primary"
        >
          {last ? "Again ↺" : "Later →"}
        </button>
      </div>

      {!reduced ? (
        <div className="mt-1 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            aria-pressed={auto}
            className="min-h-11 text-[0.5rem] tracking-[0.35em] text-muted-foreground/60 uppercase transition-colors hover:text-primary focus-visible:text-primary"
          >
            {auto ? "Pause the film ❙❙" : "Let the film play ▷"}
          </button>
          {!fullscreen ? (
            <button
              type="button"
              onClick={() => setImmersive(true)}
              className="min-h-11 text-[0.5rem] tracking-[0.35em] text-muted-foreground/60 uppercase transition-colors hover:text-primary focus-visible:text-primary"
            >
              Step inside this moment
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <Scene
      id="garden"
      image={garden}
      alt="An enchanted moonlit rose garden with floating golden frames and butterflies of light"
      particles="fireflies"
      particleCount={34}
      onEnter={onEnter}
    >
      <ChapterTitle
        chapter="Chapter III"
        title="The Memory Garden"
        subtitle="every flower keeps a moment"
      />

      <div className="mt-6">
        {stage(false)}
        {controls(false)}
      </div>

      {/* Full-screen presentation: the visual becomes the world, the chrome recedes.
          Portalled to the body so no parent transform can trap it in the scene. */}
      {immersive && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Memory: ${m.title}`}
              className="fixed inset-0 z-[95] flex flex-col justify-center overflow-hidden bg-[oklch(0.04_0.02_265)] px-3 py-5 sm:px-8"
              style={{ animation: reduced ? undefined : "rise-in 0.9s var(--ease-cine) both" }}
            >
              {/* The immersive world keeps its own weather: drifting petals and soft fog. */}
              <span aria-hidden className="fog-layer" />
              <ParticleField variant="petals" count={20} />
              <ParticleField variant="fireflies" count={14} />
              {stage(true)}
              {controls(true)}
              <button
                type="button"
                onClick={() => setImmersive(false)}
                aria-label="Leave this moment"
                className="absolute top-4 right-4 min-h-11 px-3 text-[0.5rem] tracking-[0.35em] text-muted-foreground/60 uppercase transition-colors hover:text-primary focus-visible:text-primary"
              >
                Close ✕
              </button>
            </div>,
            document.body,
          )
        : null}
    </Scene>
  );
}
