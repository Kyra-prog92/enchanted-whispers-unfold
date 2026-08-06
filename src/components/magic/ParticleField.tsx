import { useEffect, useRef } from "react";

export type FieldVariant = "fireflies" | "petals" | "dust" | "snow" | "leaves" | "embers";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  rot: number;
  vr: number;
  ph: number;
};

const PALETTE: Record<FieldVariant, string[]> = {
  fireflies: ["255,232,150", "255,244,200", "190,255,214"],
  petals: ["214,84,96", "236,150,160", "246,222,214"],
  dust: ["255,226,168", "255,246,220", "226,214,255"],
  snow: ["236,244,255", "255,255,255"],
  leaves: ["226,176,84", "212,140,60", "246,214,140"],
  embers: ["255,176,92", "255,220,150"],
};

/** Ambient particle layer: fireflies, drifting petals, magic dust, snow, leaves, embers. */
export function ParticleField({
  variant = "dust",
  count = 60,
  className = "",
}: {
  variant?: FieldVariant;
  count?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = PALETTE[variant];
    let w = 0;
    let h = 0;
    let ps: P[] = [];

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * (variant === "fireflies" ? 0.35 : 0.6),
      vy:
        variant === "fireflies"
          ? (Math.random() - 0.5) * 0.35
          : variant === "embers"
            ? -(0.25 + Math.random() * 0.6)
            : 0.25 + Math.random() * 0.9,
      r:
        variant === "petals" || variant === "leaves"
          ? 4 + Math.random() * 7
          : 0.8 + Math.random() * 2.2,
      a: 0.25 + Math.random() * 0.65,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.03,
      ph: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: count }, spawn);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx + Math.sin(t * 0.5 + p.ph) * 0.35;
        p.y += p.vy + (variant === "petals" ? Math.cos(t * 0.4 + p.ph) * 0.2 : 0);
        p.rot += p.vr;
        if (p.y > h + 24) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.y < -30 && variant === "embers") {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x > w + 24) p.x = -20;
        if (p.x < -24) p.x = w + 20;

        const color = colors[Math.floor(p.ph * 100) % colors.length]!;
        const alpha =
          variant === "fireflies" ? p.a * (0.35 + 0.65 * Math.abs(Math.sin(t * 1.6 + p.ph))) : p.a;

        if (variant === "petals" || variant === "leaves") {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.52, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${(alpha * 0.85).toFixed(3)})`;
          ctx.shadowColor = `rgba(${color},0.5)`;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        } else {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
          g.addColorStop(0, `rgba(${color},${alpha.toFixed(3)})`);
          g.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [variant, count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}