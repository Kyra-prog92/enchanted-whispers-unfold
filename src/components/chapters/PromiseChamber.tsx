import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import chamber from "@/assets/chamber.jpg";

const PROMISE = [
  "I promise to guard your heart with kindness.",
  "To celebrate every joy and soften every sorrow.",
  "To choose you not only in moments of ease, but also in moments that ask for patience and courage.",
  "To laugh with you beneath sunny skies and stand beside you through every storm.",
  "To remind you, in quiet ways and grand adventures alike, that you are deeply loved.",
  "And when the stars fill the night above us, I will still look for your hand first.",
];

export function PromiseChamber({ onEnter }: { onEnter?: (() => void) | undefined }) {
  return (
    <Scene
      id="promise"
      image={chamber}
      alt="A royal cathedral chamber with candles, falling rose petals and two golden rings"
      particles="petals"
      particleCount={34}
      onEnter={onEnter}
    >
      <ChapterTitle chapter="Chapter V" title="The Promise Chamber" subtitle="vows the candles will keep" />

      <Reveal delay={160} className="mt-7 flex justify-center gap-8">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="block h-14 w-14 rounded-full border-4 border-primary/80 sm:h-16 sm:w-16"
            style={{
              boxShadow: "var(--glow-gold), inset 0 0 20px oklch(0.85 0.14 85 / 0.5)",
              animation: `ring-spin ${14 + i * 4}s linear infinite`,
              transformStyle: "preserve-3d",
            }}
          />
        ))}
      </Reveal>

      <div className="mx-auto mt-7 max-w-2xl space-y-3 text-center">
        {PROMISE.map((line, i) => (
          <Reveal key={line} delay={i * 180}>
            <p
              className="font-body text-base leading-relaxed text-ivory/95 sm:text-lg"
              style={{ textShadow: "0 0 30px oklch(0.82 0.13 85 / 0.35)" }}
            >
              {line}
            </p>
          </Reveal>
        ))}
        <Reveal delay={PROMISE.length * 180}>
          <p className="text-gold font-display mt-6 text-[0.65rem] tracking-[0.5em] uppercase sm:text-xs">
            Today · Tomorrow · Always
          </p>
        </Reveal>
      </div>
    </Scene>
  );
}