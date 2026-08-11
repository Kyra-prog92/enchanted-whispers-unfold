import { CHAPTERS } from "@/story/chapters";

export { CHAPTERS };

/** Floating chapter compass + memory clock whose hand advances with the journey. */
export function ChapterNav({
  current,
  onJump,
}: {
  current: number;
  onJump: (index: number) => void;
}) {
  return (
    <>
      <nav
        aria-label="Chapters"
        className="fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onJump(i)}
            aria-current={i === current ? "step" : undefined}
            aria-label={`Go to chapter ${i + 1}: ${c.label.replace(/^[^·]*· /, "")}`}
            className="group flex items-center gap-3 text-[0.6rem] tracking-[0.35em] uppercase"
          >
            <span
              className="text-muted-foreground/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
              style={{ opacity: i === current ? 1 : undefined }}
            >
              {c.label}
            </span>
            <span
              className="h-2 w-2 rotate-45 border transition-all duration-500"
              style={{
                borderColor: "oklch(0.82 0.13 85 / 0.6)",
                background: i === current ? "oklch(0.85 0.14 85)" : "transparent",
                boxShadow: i === current ? "var(--glow-gold)" : "none",
              }}
            />
          </button>
        ))}
      </nav>

      <div
        aria-hidden
        className="glass-panel fixed bottom-6 left-6 z-50 hidden h-20 w-20 items-center justify-center rounded-full sm:flex"
      >
        <span className="absolute h-16 w-16 rounded-full border border-primary/30" />
        <span
          className="absolute h-7 w-px origin-bottom bg-primary/90 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ bottom: "50%", transform: `rotate(${current * 45}deg)` }}
        />
        <span className="absolute bottom-2 text-[0.5rem] tracking-[0.3em] text-muted-foreground/70 uppercase">
          memory
        </span>
      </div>
    </>
  );
}
