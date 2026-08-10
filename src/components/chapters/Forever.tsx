import { useEffect, useRef, useState } from "react";
import { SkyCanvas } from "@/components/magic/SkyCanvas";
import { ParticleField } from "@/components/magic/ParticleField";
import sky from "@/assets/forever-sky.jpg";

/** Final chapter: the camera drifts, the stars draw two hearts, the vow settles. */
export function Forever({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const ref = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    onEnter?.();
  }, [onEnter]);

  // Time-driven cinematic progress (no scrolling required).
  useEffect(() => {
    const start = performance.now();
    const duration = 16000;
    let raf = 0;
    const tick = (now: number) => {
      setP(Math.min((now - start) / duration, 1));
      if (now - start < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="forever" ref={ref} className="relative min-h-screen">
      <div className="vignette relative h-dvh overflow-hidden">
        <img
          src={sky}
          alt="The two lovers embracing on a cloud-top ledge beneath an enormous moon and endless constellations"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `scale(${1.1 + p * 0.28}) translate3d(0, ${-p * 5}%, 0)`,
            filter: `brightness(${0.85 + p * 0.2}) saturate(1.05)`,
          }}
        />
        <SkyCanvas density={1.2} />
        <ParticleField variant="petals" count={28} />

        <svg
          viewBox="0 0 400 200"
          aria-hidden
          className="absolute top-[8%] left-1/2 w-[62vw] max-w-md -translate-x-1/2"
          style={{ opacity: Math.min(Math.max((p - 0.1) * 3, 0), 1) }}
        >
          {[80, 300].map((cx, k) => (
            <path
              key={cx}
              d={`M ${cx} 130 C ${cx - 55} 80, ${cx - 30} 35, ${cx} 62 C ${cx + 30} 35, ${cx + 55} 80, ${cx} 130 Z`}
              fill="none"
              stroke="oklch(0.95 0.06 90 / 0.85)"
              strokeWidth="0.9"
              strokeDasharray="360"
              strokeDashoffset={360 - Math.min(Math.max((p - 0.1 - k * 0.06) * 900, 0), 360)}
              style={{ filter: "drop-shadow(0 0 8px oklch(0.9 0.1 90 / 0.9))" }}
            />
          ))}
        </svg>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-5 pb-32 text-center transition-opacity duration-[2000ms]"
          style={{ opacity: Math.min(Math.max((p - 0.3) * 3, 0), 1) }}
        >
          <p className="script-title text-2xl sm:text-4xl">Our story never truly ends…</p>
          <h2 className="text-gold mt-5 text-xl leading-tight tracking-[0.14em] uppercase sm:text-3xl">
            Some stories end.
            <br />
            Ours simply found forever.
          </h2>
          <p className="script-title mt-5 text-3xl sm:text-4xl">Forever Begins Here</p>
        </div>
      </div>
    </section>
  );
}
