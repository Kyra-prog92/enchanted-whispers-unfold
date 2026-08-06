import { useState } from "react";
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
    caption: "Chandeliers held their breath while we forgot the rest of the world.",
  },
  {
    src: lake,
    title: "The Quiet Lake",
    caption: "A hundred candles on the water, and still your eyes were the brightest light.",
  },
  {
    src: roseTunnel,
    title: "The Rose Tunnel",
    caption: "We walked until the petals learned our names.",
  },
  {
    src: moonBridge,
    title: "The Moon Bridge",
    caption: "Above the clouds you said forever, and the wind carried it away as a promise.",
  },
];

export function MemoryGarden({ onEnter }: { onEnter?: () => void }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Scene
      id="garden"
      image={garden}
      alt="An enchanted moonlit rose garden with floating golden frames and butterflies of light"
      particles="fireflies"
      particleCount={70}
      onEnter={onEnter}
    >
      <ChapterTitle
        chapter="Chapter III"
        title="The Memory Garden"
        subtitle="every flower keeps a moment"
      />

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {MEMORIES.map((m, i) => (
          <Reveal key={m.title} delay={i * 160}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden rounded-sm p-3 text-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2"
              style={{
                background: "var(--gradient-gold)",
                boxShadow: "var(--shadow-royal), 0 0 40px oklch(0.82 0.13 85 / 0.25)",
                animation: `lantern-swing ${9 + i}s ease-in-out infinite alternate`,
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={m.src}
                  alt={m.title}
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="h-56 w-full object-cover transition-transform duration-[2400ms] group-hover:scale-110 sm:h-64"
                  style={{ filter: "brightness(0.82) saturate(1.08)" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent,oklch(0.08_0.03_265/0.75))]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-sm tracking-[0.3em] text-ivory uppercase">
                    {m.title}
                  </p>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[oklch(0.05_0.02_265/0.88)] px-6 backdrop-blur-md"
          style={{ animation: "rise-in 0.9s var(--ease-cine) both" }}
          onClick={() => setActive(null)}
          role="presentation"
        >
          <figure className="glass-panel max-w-3xl overflow-hidden rounded-sm p-4">
            <img
              src={MEMORIES[active]!.src}
              alt={MEMORIES[active]!.title}
              className="max-h-[62vh] w-full object-cover"
              style={{ animation: "ken-burns 18s ease-in-out infinite alternate" }}
            />
            <figcaption className="p-6 text-center">
              <p className="text-gold font-display text-lg tracking-[0.3em] uppercase">
                {MEMORIES[active]!.title}
              </p>
              <p className="mt-3 text-lg text-muted-foreground italic">
                {MEMORIES[active]!.caption}
              </p>
              <p className="mt-6 text-[0.6rem] tracking-[0.4em] text-muted-foreground/60 uppercase">
                click anywhere to close
              </p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </Scene>
  );
}