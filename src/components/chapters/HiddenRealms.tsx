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
    <section id="realms" className="vignette relative overflow-hidden py-32">
      <ParticleField variant="dust" count={50} />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <p className="font-display text-[0.68rem] tracking-[0.62em] text-primary/80 uppercase">
            Interlude
          </p>
          <h2 className="text-gold mt-5 text-4xl tracking-[0.14em] uppercase sm:text-5xl">
            Hidden Realms
          </h2>
          <p className="script-title mt-4 text-2xl">doors the kingdom rarely opens</p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REALMS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="group relative block h-72 w-full overflow-hidden rounded-sm border border-primary/25 text-left"
                style={{ boxShadow: "var(--shadow-royal)" }}
              >
                <img
                  src={r.src}
                  alt={r.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2600ms] group-hover:scale-115"
                  style={{ filter: "brightness(0.72) saturate(1.05)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.02_265/0.92)] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-gold font-display text-xs tracking-[0.34em] uppercase">
                    {r.name}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{r.line}</p>
                  <p
                    className="script-title mt-3 text-xl transition-all duration-700"
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