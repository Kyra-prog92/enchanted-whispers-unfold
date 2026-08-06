import { useEffect, useRef } from "react";

type Sp = { x: number; y: number; vx: number; vy: number; life: number; r: number };

/** Golden magic dust trailing the cursor, with butterfly-like wandering lights. */
export function CursorMagic() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const sparks: Sp[] = [];
    const pointer = { x: w / 2, y: h / 2, active: false };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      for (let i = 0; i < 2; i++) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.25,
          life: 1,
          r: 1 + Math.random() * 2.4,
        });
      }
      if (sparks.length > 240) sparks.splice(0, sparks.length - 240);
    };
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * (1.4 + Math.random() * 2.2),
          vy: Math.sin(a) * (1.4 + Math.random() * 2.2),
          life: 1,
          r: 1.2 + Math.random() * 2.6,
        });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    const butterflies = Array.from({ length: 3 }, (_, i) => ({
      x: w / 2,
      y: h / 2,
      ph: i * 2.1,
      lag: 0.012 + i * 0.006,
    }));

    let raf = 0;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.012;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
        g.addColorStop(0, `rgba(255,234,178,${(s.life * 0.85).toFixed(3)})`);
        g.addColorStop(1, "rgba(255,214,140,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2);
        ctx.fill();
      }

      if (pointer.active) {
        for (const b of butterflies) {
          const tx = pointer.x + Math.cos(t * 1.1 + b.ph) * 62;
          const ty = pointer.y + Math.sin(t * 1.4 + b.ph) * 46;
          b.x += (tx - b.x) * b.lag * 6;
          b.y += (ty - b.y) * b.lag * 6;
          const flap = Math.abs(Math.sin(t * 8 + b.ph));
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(Math.sin(t + b.ph) * 0.3);
          ctx.shadowColor = "rgba(255,236,180,0.9)";
          ctx.shadowBlur = 16;
          ctx.fillStyle = `rgba(255,240,196,${(0.35 + flap * 0.45).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(-5, 0, 6, 3 + flap * 5, -0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(5, 0, 6, 3 + flap * 5, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full mix-blend-screen"
    />
  );
}