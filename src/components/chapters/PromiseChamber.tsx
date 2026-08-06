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

export function PromiseChamber({ onEnter }: { onEnter?: () => void }) {
  return (
    <Scene
      id="promise"
      image={chamber}
      alt="A royal cathedral chamber with candles, falling rose petals and two golden rings"
      particles="petals"
      particleCount={46}
      onEnter={onEnter}
    >
      <ChapterTitle chapter="Chapter V" title="The Promise Chamber" subtitle="vows the candles will keep" />

      <Reveal delay={160} className="mt-14 flex justify-center gap-10">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="block h-24 w-24 rounded-full border-[6px] border-primary/80"
            style={{
              boxShadow: "var(--glow-gold), inset 0 0 20px oklch(0.85 0.14 85 / 0.5)",
              animation: `ring-spin ${14 + i * 4}s linear infinite`,
              transformStyle: "preserve-3d",
            }}
          />
        ))}
      </Reveal>

      <div className="mx-auto mt-14 max-w-3xl space-y-6 text-center">
        {PROMISE.map((line, i) => (
          <Reveal key={line} delay={i * 240}>
            <p
              className="font-body text-xl leading-relaxed text-ivory/95 sm:text-2xl"
              style={{ textShadow: "0 0 30px oklch(0.82 0.13 85 / 0.35)" }}
            >
              {line}
            </p>
          </Reveal>
        ))}
        <Reveal delay={PROMISE.length * 240}>
          <p className="text-gold font-display mt-10 text-sm tracking-[0.6em] uppercase">
            Today · Tomorrow · Always
          </p>
        </Reveal>
      </div>
    </Scene>
  );
}