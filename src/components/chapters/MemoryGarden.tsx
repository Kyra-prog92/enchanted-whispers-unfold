import { useCallback, useEffect, useRef, useState } from "react";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { MemoryMoment } from "@/components/magic/MemoryMoment";
import { GARDEN_MEMORIES as MEMORIES } from "@/story/memories";
import garden from "@/assets/garden.jpg";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The memories play as a guided story sequence — one moment at a time, joined by a
 * timeline, so the visitor walks a journey rather than browsing a gallery. Any
 * moment can be entered full-screen, where the visual becomes the whole world.
 */
export function MemoryGarden({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const [i, setI] = useState(0);
  const [immersive, setImmersive] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setI(((next % MEMORIES.length) + MEMORIES.length) % MEMORIES.length);
  }, []);
  const m = MEMORIES[i]!;
  const last = i === MEMORIES.length - 1;

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
      go(dx < 0 ? i + 1 : i - 1);
    },
  };

  const counter = (
    <span className="text-[0.6rem] tracking-[0.35em] text-primary uppercase">
      {pad(i + 1)} / {pad(MEMORIES.length)}
    </span>
  );

  const prevNext = (
    <div className="flex items-center justify-center gap-4 text-[0.55rem] tracking-[0.35em] uppercase">
      <button
        type="button"
        onClick={() => go(i - 1)}
        aria-label="Previous memory"
        className="min-h-11 px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary"
      >
        ← Earlier
      </button>
      {counter}
      <button
        type="button"
        onClick={() => (last ? go(0) : go(i + 1))}
        aria-label={last ? "Walk the memories again" : "Next memory"}
        className="min-h-11 px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary"
      >
        {last ? "Again ↺" : "Later →"}
      </button>
    </div>
  );

  return (
    <Scene
      id="garden"
      image={garden}
      alt="An enchanted moonlit rose garden with floating golden frames and butterflies of light"
      particles="fireflies"
      particleCount={46}
      onEnter={onEnter}
    >
      <ChapterTitle
        chapter="Chapter III"
        title="The Memory Garden"
        subtitle="every flower keeps a moment"
      />

      <div className="mt-7" {...swipe}>
        <MemoryMoment memory={m} className="mx-auto max-w-2xl" />

        <div className="mx-auto mt-4 flex max-w-2xl justify-center">
          <button
            type="button"
            onClick={() => setImmersive(true)}
            className="min-h-11 text-[0.55rem] tracking-[0.35em] text-muted-foreground uppercase transition-colors hover:text-primary focus-visible:text-primary"
          >
            Step inside this moment
          </button>
        </div>

        {/* Journey timeline — the memories are stops on one path, not tiles in a grid. */}
        <nav
          aria-label="Memory timeline"
          className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-1 sm:gap-2"
        >
          {MEMORIES.map((memory, k) => (
            <button
              key={memory.title}
              type="button"
              onClick={() => go(k)}
              aria-current={k === i ? "step" : undefined}
              aria-label={`Memory ${k + 1}: ${memory.title}`}
              className="group flex flex-1 flex-col items-center gap-2"
            >
              <span
                className="h-px w-full transition-colors duration-700"
                style={{
                  background:
                    k <= i ? "oklch(0.85 0.14 85 / 0.85)" : "oklch(0.85 0.14 85 / 0.22)",
                }}
              />
              <span
                className="h-2 w-2 rotate-45 border transition-all duration-500"
                style={{
                  borderColor: "oklch(0.85 0.14 85 / 0.7)",
                  background: k === i ? "oklch(0.85 0.14 85)" : "transparent",
                  boxShadow: k === i ? "var(--glow-gold)" : "none",
                }}
              />
              <span className="hidden text-[0.5rem] tracking-[0.25em] text-muted-foreground uppercase sm:block">
                {k + 1}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-5">{prevNext}</div>
      </div>

      {/* Full-screen presentation: the visual becomes the world, the chrome recedes.
          Portalled to the body so no parent transform can trap it in the scene. */}
      {immersive && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Memory: ${m.title}`}
              className="fixed inset-0 z-[95] flex flex-col justify-center overflow-hidden bg-[oklch(0.05_0.02_265/0.97)] px-4 py-6 sm:px-8"
              style={{ animation: "rise-in 0.9s var(--ease-cine) both" }}
              {...swipe}
            >
              <MemoryMoment
                memory={m}
                fullscreen
                className="mx-auto w-full max-w-5xl"
              />
              <div className="mt-5">{prevNext}</div>
              <button
                type="button"
                onClick={() => setImmersive(false)}
                aria-label="Leave this moment"
                className="absolute top-4 right-4 min-h-11 px-3 text-[0.55rem] tracking-[0.35em] text-muted-foreground uppercase transition-colors hover:text-primary focus-visible:text-primary"
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
