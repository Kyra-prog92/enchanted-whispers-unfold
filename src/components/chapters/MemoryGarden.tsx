import { useCallback, useState } from "react";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import garden from "@/assets/garden.jpg";
import ballroom from "@/assets/ballroom.jpg";
import lake from "@/assets/lake.jpg";
import roseTunnel from "@/assets/rose-tunnel.jpg";
import moonBridge from "@/assets/moon-bridge.jpg";

const MEMORIES = [
  {
    src: ballroom,
    title: "The First Dance",
    when: "The night we met",
    caption: "Chandeliers held their breath while we forgot the rest of the world.",
  },
  {
    src: lake,
    title: "The Quiet Lake",
    when: "The first summer",
    caption: "A hundred candles on the water, and still your eyes were the brightest light.",
  },
  {
    src: roseTunnel,
    title: "The Rose Tunnel",
    when: "The long walk home",
    caption: "We walked until the petals learned our names.",
  },
  {
    src: moonBridge,
    title: "The Moon Bridge",
    when: "The night you said forever",
    caption: "Above the clouds you said forever, and the wind carried it away as a promise.",
  },
];

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

      <Reveal delay={160} className="mt-7">
        <figure
          key={m.title}
          className="glass-panel mx-auto max-w-2xl overflow-hidden rounded-sm p-3"
          style={{ animation: "rise-in 1.1s var(--ease-cine) both" }}
        >
          <div className="relative overflow-hidden rounded-sm">
            <img
              src={m.src}
              alt={`${m.title} — ${m.caption}`}
              loading="lazy"
              width={1400}
              height={900}
              className="h-44 w-full object-cover sm:h-64"
              style={{ filter: "brightness(0.85) saturate(1.06)" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_50%,transparent,oklch(0.08_0.03_265/0.7))]" />
          </div>
          <figcaption className="px-4 py-5 text-center">
            <p className="text-[0.55rem] tracking-[0.4em] text-primary uppercase">{m.when}</p>
            <p className="text-gold mt-2 font-display text-sm tracking-[0.28em] uppercase sm:text-base">
              {m.title}
            </p>
            <p className="mt-3 text-base text-ivory/90 italic">{m.caption}</p>
          </figcaption>
        </figure>

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
      </Reveal>
    </Scene>
  );
}