import { useCallback, useEffect, useRef, useState } from "react";
import { SkyCanvas } from "./SkyCanvas";
import { ParticleField } from "./ParticleField";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import castleMoon from "@/assets/castle-moon.jpg";
import gates from "@/assets/gates.jpg";

/**
 * Opening cinematic: darkness, stars, a flight through the clouds toward the moon
 * and the castle, then the enchanted gates opening in golden light.
 */
export function Intro({ onEnter }: { onEnter: () => void }) {
  const [beat, setBeat] = useState(0); // 0 dark → 1 stars → 2 flight → 3 gates → 4 title
  const reduced = usePrefersReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) {
      setBeat(4);
      return;
    }
    const timers = [
      window.setTimeout(() => setBeat(1), 700),
      window.setTimeout(() => setBeat(2), 3200),
      window.setTimeout(() => setBeat(3), 8200),
      window.setTimeout(() => setBeat(4), 11500),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  // Cursor-responsive depth: the environment leans with the visitor, never jitters.
  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => setPointer({ x, y }));
    },
    [reduced],
  );

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <section
      onPointerMove={onPointerMove}
      aria-label="Opening overture"
      className="vignette fixed inset-0 z-[60] overflow-hidden bg-[oklch(0.05_0.02_265)]"
    >
      <div
        className="absolute inset-0 transition-opacity duration-[2500ms]"
        style={{
          opacity: beat >= 1 ? 1 : 0,
          transform: `translate3d(${pointer.x * -6}px, ${pointer.y * -4}px, 0)`,
        }}
      >
        <SkyCanvas density={1.5} />
      </div>
      <div
        className="absolute inset-0 transition-all duration-[4000ms] ease-out"
        style={{
          opacity: beat >= 2 && beat < 3 ? 1 : 0,
          transform: `${beat >= 2 ? "scale(1.25)" : "scale(1.9)"} translate3d(${pointer.x * -14}px, ${pointer.y * -8}px, 0)`,
        }}
      >
        <img
          src={castleMoon}
          alt="A colossal enchanted castle beneath an enormous moon"
          width={1920}
          height={1088}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.9) saturate(1.05)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,transparent,oklch(0.06_0.02_265/0.85))]" />
        <div className="fog-layer" />
      </div>
      <div
        className="absolute inset-0 transition-opacity duration-[2200ms]"
        style={{
          opacity: beat >= 3 ? 1 : 0,
          transform: `translate3d(${pointer.x * -8}px, 0, 0)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-1/2 origin-left bg-cover bg-right"
            style={{
              backgroundImage: `url(${gates})`,
              animation: beat >= 3 ? "gate-left 5s var(--ease-cine) 1.2s both" : undefined,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/2 origin-right bg-cover bg-left"
            style={{
              backgroundImage: `url(${gates})`,
              animation: beat >= 3 ? "gate-right 5s var(--ease-cine) 1.2s both" : undefined,
            }}
          />
        </div>
        <div
          className="absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_60%,oklch(0.9_0.13_85/0.55),transparent_70%)] transition-opacity duration-[3000ms]"
          style={{ opacity: beat >= 4 ? 1 : 0.15 }}
        />
      </div>
      <div className="fog-layer" />
      <ParticleField variant="fireflies" count={32} />
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center transition-all duration-[2500ms]"
        style={{
          opacity: beat >= 4 ? 1 : 0,
          transform: beat >= 4 ? "translateY(0)" : "translateY(20px)",
          pointerEvents: beat >= 4 ? "auto" : "none",
        }}
      >
        <p
          className="font-display text-[0.55rem] tracking-[0.55em] text-primary uppercase sm:tracking-[0.7em]"
          style={{ animation: beat >= 4 ? "word-rise 1.4s var(--ease-cine) both" : undefined }}
        >
          An enchanted kingdom
        </p>
        {/* The title arrives one word at a time, the way a story is told aloud. */}
        <h1 className="text-gold mt-4 flex flex-wrap justify-center gap-x-3 text-3xl leading-tight tracking-[0.16em] uppercase sm:text-5xl">
          {["Forever", "Begins", "Here"].map((word, i) => (
            <span
              key={word}
              className="inline-block"
              style={{
                animation: reduced
                  ? undefined
                  : beat >= 4
                    ? `word-rise 1.6s var(--ease-cine) ${350 + i * 480}ms both`
                    : undefined,
                opacity: reduced || beat >= 4 ? undefined : 0,
              }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p
          className="script-title mt-4 text-2xl sm:text-3xl"
          style={{
            animation:
              !reduced && beat >= 4 ? "word-rise 1.8s var(--ease-cine) 1900ms both" : undefined,
          }}
        >
          a love story written in moonlight
        </p>
        <button
          type="button"
          onClick={onEnter}
          aria-label="Enter the kingdom and begin Chapter I, The Enchanted Gates"
          className="artifact-btn mt-9 min-h-11 px-8 py-3.5 text-[0.65rem]"
          style={{
            animation:
              !reduced && beat >= 4 ? "word-rise 1.4s var(--ease-cine) 2600ms both" : undefined,
          }}
        >
          Enter the Kingdom
        </button>
        <p className="mt-6 text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
          Best experienced with sound
        </p>
      </div>
      <button
        type="button"
        onClick={onEnter}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[0.6rem] tracking-[0.4em] text-muted-foreground/60 uppercase transition-colors hover:text-primary"
        style={{ opacity: beat >= 4 ? 0 : 1, pointerEvents: beat >= 4 ? "none" : "auto" }}
      >
        Skip the overture
      </button>
      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-[2600ms]"
        style={{ opacity: beat === 0 ? 1 : 0 }}
      />
    </section>
  );
}
