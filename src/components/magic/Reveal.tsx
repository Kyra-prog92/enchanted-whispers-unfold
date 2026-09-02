import { useEffect, useRef, useState, type ReactNode } from "react";

/** Cinematic reveal: content rises out of blur when the scene enters frame. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? undefined : 0,
        animation: seen ? `rise-in 1.5s var(--ease-cine) ${delay}ms both` : undefined,
      }}
    >
      {children}
    </div>
  );
}
