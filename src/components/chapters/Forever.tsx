import { useEffect, useRef, useState } from "react";
import { SkyCanvas } from "@/components/magic/SkyCanvas";
import { ParticleField } from "@/components/magic/ParticleField";
import { Reveal } from "@/components/magic/Reveal";
import sky from "@/assets/forever-sky.jpg";

/** Final chapter: the camera leaves the castle, the stars draw two hearts, credits drift. */
export function Forever({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const ref = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setP(Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onEnter) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && onEnter(), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onEnter]);

  return (
    <section id="forever" ref={ref} className="relative h-[320vh]">
      <div className="vignette sticky top-0 h-screen overflow-hidden">
        <img
          src={sky}
          alt="An endless night sky above the clouds with a vast moon and constellations"
          loading="lazy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `scale(${1.1 + p * 0.35}) translate3d(0, ${-p * 8}%, 0)`,
            filter: `brightness(${0.85 + p * 0.25}) saturate(1.05)`,
          }}
        />
        <SkyCanvas density={1.7} />
        <ParticleField variant="petals" count={40} />

        <svg
          viewBox="0 0 400 200"
          aria-hidden
          className="absolute top-[16%] left-1/2 w-[70vw] max-w-2xl -translate-x-1/2"
          style={{ opacity: Math.min(Math.max((p - 0.2) * 3, 0), 1) }}
        >
          {[80, 300].map((cx, k) => (
            <path
              key={cx}
              d={`M ${cx} 130 C ${cx - 55} 80, ${cx - 30} 35, ${cx} 62 C ${cx + 30} 35, ${cx + 55} 80, ${cx} 130 Z`}
              fill="none"
              stroke="oklch(0.95 0.06 90 / 0.85)"
              strokeWidth="0.9"
              strokeDasharray="360"
              strokeDashoffset={360 - Math.min(Math.max((p - 0.2 - k * 0.06) * 900, 0), 360)}
              style={{ filter: "drop-shadow(0 0 8px oklch(0.9 0.1 90 / 0.9))" }}
            />
          ))}
        </svg>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: Math.min(Math.max((p - 0.45) * 3, 0), 1) }}
        >
          <p className="script-title text-3xl sm:text-5xl">Our story never truly ends…</p>
          <h2 className="text-gold mt-10 text-3xl leading-tight tracking-[0.16em] uppercase sm:text-5xl">
            Some stories end.
            <br />
            Ours simply found forever.
          </h2>
          <p className="script-title mt-10 text-4xl sm:text-5xl">Forever Begins Here</p>
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: Math.min(Math.max((p - 0.86) * 6, 0), 0.92) }}
        />

        <Reveal
          delay={0}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.5em] text-muted-foreground/60 uppercase"
        >
          the wind carries the rest
        </Reveal>
      </div>
    </section>
  );
}