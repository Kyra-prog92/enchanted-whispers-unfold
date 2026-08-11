import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export type Memory = {
  src: string;
  /** Short title of the moment, e.g. "The First Dance". */
  title: string;
  /** Optional when-it-happened line, e.g. "The night we met". */
  when?: string;
  caption: string;
  /** Optional ambient sound played softly while this memory is on screen. */
  ambient?: string;
  /** Optional alt text; falls back to the title. */
  alt?: string;
};

/**
 * One remembered moment: framed image, date, title, narration and an optional
 * ambient bed. Reusable for any future memory anywhere in the story.
 */
export function MemoryMoment({
  memory,
  soundEnabled = false,
  className = "",
}: {
  memory: Memory;
  /** Ambient audio only ever plays when the visitor has already allowed sound. */
  soundEnabled?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!memory.ambient || !soundEnabled) return;
    const el = new Audio(memory.ambient);
    el.loop = true;
    el.volume = 0.18;
    audioRef.current = el;
    void el.play().catch(() => undefined);
    return () => {
      el.pause();
      audioRef.current = null;
    };
  }, [memory.ambient, soundEnabled]);

  return (
    <Reveal key={memory.title} className={className}>
      <figure className="glass-panel overflow-hidden rounded-sm">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={memory.src}
            alt={memory.alt ?? memory.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{
              animation: reduced ? undefined : "ken-burns 22s ease-in-out infinite alternate",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.07_0.03_265/0.92),oklch(0.07_0.03_265/0.18)_60%,transparent)]" />
        </div>
        <figcaption className="px-5 py-4 text-center sm:px-7 sm:py-5">
          {memory.when ? (
            <p className="text-[0.55rem] tracking-[0.4em] text-primary uppercase">{memory.when}</p>
          ) : null}
          <h3 className="text-gold mt-2 font-display text-lg tracking-[0.16em] uppercase sm:text-xl">
            {memory.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ivory/90 italic sm:text-base">
            {memory.caption}
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}
