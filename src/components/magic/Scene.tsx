import { useEffect, useRef, useState, type ReactNode } from "react";
import { ParticleField, type FieldVariant } from "./ParticleField";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * A cinematic chapter stage: parallax matte-painting backdrop with slow camera
 * push, volumetric god rays, ambient particles and a heavy film vignette.
 */
export function Scene({
  id,
  image,
  alt,
  particles = "dust",
  particleCount = 60,
  rays = true,
  children,
  onEnter,
  className = "",
}: {
  id: string;
  image: string;
  alt: string;
  particles?: FieldVariant;
  particleCount?: number;
  rays?: boolean;
  children: ReactNode;
  onEnter?: (() => void) | undefined;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const progress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
        setOffset(Math.max(Math.min(progress, 1.4), -1.4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onEnter) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) onEnter();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onEnter]);

  return (
    <section
      id={id}
      ref={ref}
      className={`vignette relative flex min-h-dvh items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 will-change-transform">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{
            transform: `scale(1.06) translate3d(0, ${offset * -4}%, 0)`,
            filter: "saturate(1.05) contrast(1.05) brightness(0.86)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_40%,oklch(0.07_0.03_265/0.35),oklch(0.07_0.03_265/0.82))]" />
      </div>

      {rays && !reduced ? (
        <div className="godrays pointer-events-none absolute -top-1/3 left-0 h-[160%] w-full opacity-70" />
      ) : null}

      {/* Low mist keeps every scene in the same weather. */}
      <span aria-hidden className="fog-layer" />

      <ParticleField variant={particles} count={particleCount} />

      <div
        className="relative z-10 mx-auto w-full max-w-4xl px-5 pt-16 pb-36 sm:px-6 sm:pt-20 sm:pb-40"
        style={{ transform: `translate3d(0, ${offset * 1.5}%, 0)` }}
      >
        {children}
      </div>
    </section>
  );
}
