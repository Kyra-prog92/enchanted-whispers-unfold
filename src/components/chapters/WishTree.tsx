import { useState } from "react";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import tree from "@/assets/wishing-tree.jpg";

const WISH = [
  "I wish that every sunrise finds us laughing together.",
  "That every storm only teaches us to hold each other closer.",
  "That our hearts never forget the wonder they found in one another.",
  "May every path we walk lead us home — to each other.",
  "And if destiny grants only one miracle…",
  "let it be that we never stop choosing one another.",
];

export function WishTree({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const [released, setReleased] = useState(0);

  return (
    <Scene
      id="wish"
      image={tree}
      alt="A colossal glowing wishing tree with golden leaves"
      particles="leaves"
      particleCount={40}
      onEnter={onEnter}
    >
      <ChapterTitle chapter="Chapter IV" title="The Wishing Tree" subtitle="ask, and the leaves listen" />

      <Reveal delay={220} className="mx-auto mt-7 max-w-xl">
        <div
          className="glass-panel rounded-sm px-6 py-7 text-center sm:px-10 sm:py-9"
          style={{ animation: "lantern-swing 12s ease-in-out infinite alternate" }}
        >
          {WISH.map((line, i) => (
            <p
              key={line}
              className="font-body text-base leading-relaxed text-ivory/90 sm:text-lg"
              style={{ animation: `ink-write 1.6s ease-out ${0.3 + i * 0.6}s both`, marginTop: i ? "0.6rem" : 0 }}
            >
              {line}
            </p>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setReleased((n) => n + 1)}
          className="artifact-btn px-8 py-3.5 text-[0.6rem]"
        >
          Touch the Tree
        </button>
        <p aria-live="polite" className="mt-4 text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
          {released === 0
            ? "and release the golden birds"
            : `${released * 7} golden birds carried the wish into the sky`}
        </p>
      </div>

      {released > 0 ? (
        <div key={released} className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute block h-2 w-6 rounded-full bg-primary/80"
              style={{
                left: `${8 + i * 6.4}%`,
                bottom: "12%",
                boxShadow: "0 0 22px oklch(0.85 0.14 85 / 0.9)",
                animation: `rise-in 0.6s ease-out both, drift-slow ${3 + i * 0.2}s ease-in-out ${i * 0.08}s both`,
                transform: `translateY(-${20 + i * 4}vh) rotate(${i % 2 ? 12 : -12}deg)`,
                transition: "transform 4s var(--ease-cine)",
                opacity: 0.9,
              }}
            />
          ))}
        </div>
      ) : null}
    </Scene>
  );
}