import { useCallback, useState } from "react";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import { MemoryMoment } from "@/components/magic/MemoryMoment";
import { GARDEN_MEMORIES as MEMORIES } from "@/story/memories";
import garden from "@/assets/garden.jpg";

/**
 * The memories play as a guided story sequence — one moment at a time, joined by a
 * timeline, so the visitor walks a journey rather than browsing a gallery.
 */
export function MemoryGarden({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const [i, setI] = useState(0);
  const go = useCallback((next: number) => {
    setI(((next % MEMORIES.length) + MEMORIES.length) % MEMORIES.length);
  }, []);
  const m = MEMORIES[i]!;

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

      <div className="mt-7">
        <MemoryMoment memory={m} className="mx-auto max-w-2xl" />

        {/* Journey timeline — the memories are stops on one path, not tiles in a grid. */}
        <nav
          aria-label="Memory timeline"
          className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-1 sm:gap-2"
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

        <div className="mt-5 flex items-center justify-center gap-4 text-[0.55rem] tracking-[0.35em] uppercase">
          <button
            type="button"
            onClick={() => go(i - 1)}
            className="min-h-11 px-3 text-muted-foreground transition-colors hover:text-primary"
          >
            ← Earlier
          </button>
          <span className="text-primary">
            {i + 1} / {MEMORIES.length}
          </span>
          <button
            type="button"
            onClick={() => go(i + 1)}
            className="min-h-11 px-3 text-muted-foreground transition-colors hover:text-primary"
          >
            Later →
          </button>
        </div>
      </div>
    </Scene>
  );
}