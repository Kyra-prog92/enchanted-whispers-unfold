import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; tw: number; p: number };
type Shooting = { x: number; y: number; vx: number; vy: number; life: number; len: number };

/** Twinkling starfield with drifting nebula haze and occasional shooting stars. */
export function SkyCanvas({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    const shooting: Shooting[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((w * h) / 9000) * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.25,
        tw: Math.random() * 0.9 + 0.25,
        p: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const a = 0.35 + 0.65 * Math.abs(Math.sin(s.p + t * s.tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238,242,255,${a.toFixed(3)})`;
        ctx.fill();
        if (s.r > 1.05) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,214,255,${(a * 0.05).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (Math.random() < 0.0035 && shooting.length < 3) {
        const x = Math.random() * w * 0.8;
        shooting.push({
          x,
          y: Math.random() * h * 0.4,
          vx: 6 + Math.random() * 5,
          vy: 2 + Math.random() * 2,
          life: 1,
          len: 120 + Math.random() * 160,
        });
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i]!;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.008;
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.34);
        g.addColorStop(0, `rgba(255,246,214,${Math.max(s.life, 0).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,246,214,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len * 0.34);
        ctx.stroke();
        if (s.life <= 0 || s.x > w + 200) shooting.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
  );
}
