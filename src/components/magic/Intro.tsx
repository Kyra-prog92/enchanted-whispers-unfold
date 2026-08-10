import { useEffect, useState } from "react";
import { SkyCanvas } from "./SkyCanvas";
import { ParticleField } from "./ParticleField";
import castleMoon from "@/assets/castle-moon.jpg";
import gates from "@/assets/gates.jpg";

/**
 * Opening cinematic: darkness, stars, a flight through the clouds toward the moon
 * and the castle, then the enchanted gates opening in golden light.
 */
export function Intro({ onEnter }: { onEnter: () => void }) {
  const [beat, setBeat] = useState(0); // 0 dark → 1 stars → 2 flight → 3 gates → 4 title

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setBeat(1), 700),
      window.setTimeout(() => setBeat(2), 3200),
      window.setTimeout(() => setBeat(3), 8200),
      window.setTimeout(() => setBeat(4), 11500),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <section className="vignette fixed inset-0 z-[60] overflow-hidden bg-[oklch(0.05_0.02_265)]">
      <div
        className="absolute inset-0 transition-opacity duration-[2500ms]"
        style={{ opacity: beat >= 1 ? 1 : 0 }}
      >
        <SkyCanvas density={1.5} />
      </div>
      <div
        className="absolute inset-0 transition-all duration-[4000ms] ease-out"
        style={{
          opacity: beat >= 2 && beat < 3 ? 1 : 0,
          transform: beat >= 2 ? "scale(1.25)" : "scale(1.9)",
        }}
      >
        <img
          src={castleMoon}
          alt="A colossal enchanted castle beneath an enormous moon"
          width={1920}
          height={1088}
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.9) saturate(1.05)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_35%,transparent,oklch(0.06_0.02_265/0.85))]" />
      </div>
      <div
        className="absolute inset-0 transition-opacity duration-[2200ms]"
        style={{ opacity: beat >= 3 ? 1 : 0 }}
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
      <ParticleField variant="fireflies" count={32} />
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center transition-all duration-[2500ms]"
        style={{
          opacity: beat >= 4 ? 1 : 0,
          transform: beat >= 4 ? "translateY(0)" : "translateY(28px)",
          pointerEvents: beat >= 4 ? "auto" : "none",
        }}
      >
        <p className="font-display text-[0.55rem] tracking-[0.55em] text-primary uppercase sm:tracking-[0.7em]">
          An enchanted kingdom
        </p>
        <h1 className="text-gold mt-4 text-3xl leading-tight tracking-[0.16em] uppercase sm:text-5xl">
          Forever Begins Here
        </h1>
        <p className="script-title mt-4 text-2xl sm:text-3xl">
          a love story written in moonlight
        </p>
        <button type="button" onClick={onEnter} className="artifact-btn mt-9 px-8 py-3.5 text-[0.65rem]">
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