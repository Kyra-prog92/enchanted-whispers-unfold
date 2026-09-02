import { useState } from "react";
import { Reveal } from "@/components/magic/Reveal";
import { ParticleField } from "@/components/magic/ParticleField";
import roseTunnel from "@/assets/rose-tunnel.jpg";
import moonBridge from "@/assets/moon-bridge.jpg";
import observatory from "@/assets/observatory.jpg";
import lake from "@/assets/lake.jpg";
import ballroom from "@/assets/ballroom.jpg";
import library from "@/assets/library.jpg";

const REALMS = [
  {
    src: roseTunnel,
    name: "The Rose Tunnel",
    line: "An endless corridor of roses where the petals never finish falling.",
    secret: "Every petal here is a night I thought of you.",
  },
  {
    src: moonBridge,
    name: "The Moon Bridge",
    line: "A crystal span above the clouds; moonlight pools beneath your steps.",
    secret: "Halfway across, you said forever — and the wind agreed.",
  },
  {
    src: observatory,
    name: "The Secret Observatory",
    line: "An ancient tower where the constellations rearrange themselves for us.",
    secret: "Look closely: the stars spell the day we met.",
  },
  {
    src: lake,
    name: "The Enchanted Lake",
    line: "Mirror water, floating candles, mist that hums a lullaby.",
    secret: "Make a wish here and the moon keeps it safe.",
  },
  {
    src: ballroom,
    name: "The Royal Ballroom",
    line: "Chandeliers, golden light, a waltz that never quite ends.",
    secret: "One more dance. Always one more dance.",
  },
  {
    src: library,
    name: "The Endless Library",
    line: "Floating books rewriting themselves into our story.",
    secret: "Chapter one begins with your name.",
  },
];

/** Hidden transitional realms — hovering a doorway reveals its secret message. */
export function HiddenRealms() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="realms"
      className="vignette relative min-h-dvh overflow-hidden pt-16 pb-36 sm:pt-20 sm:pb-40"
    >
      <ParticleField variant="dust" count={34} />
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal className="text-center">
          <p className="font-display text-[0.6rem] tracking-[0.5em] text-primary uppercase">
            Interlude
          </p>
          <h2 className="text-gold mt-3 text-2xl tracking-[0.12em] uppercase sm:text-4xl">
            Hidden Realms
          </h2>
          <p className="script-title mt-2 text-xl">doors the kingdom rarely opens</p>
        </Reveal>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REALMS.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="group relative block h-44 w-full overflow-hidden rounded-sm border border-primary/25 text-left sm:h-52"
                style={{ boxShadow: "var(--shadow-royal)" }}
              >
                <img
                  src={r.src}
                  alt={r.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2600ms] group-hover:scale-[1.08]"
                  style={{ filter: "brightness(0.72) saturate(1.05)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.02_265/0.96)] via-[oklch(0.06_0.02_265/0.55)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-gold font-display text-[0.6rem] tracking-[0.3em] uppercase">
                    {r.name}
                  </p>
                  <p className="mt-1.5 text-xs text-ivory/80">{r.line}</p>
                  <p
                    className="script-title mt-2 text-lg transition-all duration-700"
                    style={{
                      opacity: open === i ? 1 : 0,
                      transform: open === i ? "translateY(0)" : "translateY(10px)",
                    }}
                  >
                    {r.secret}
                  </p>
                </div>
                <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary/80 [animation:soft-pulse_3s_ease-in-out_infinite]" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
