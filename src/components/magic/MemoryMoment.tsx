import { useEffect, useRef } from "react";
import { Reveal } from "./Reveal";
import { MemoryVideo } from "./MemoryVideo";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** The kinds of moment the story can hold. Reusable in any future chapter. */
export type MemoryKind = "image" | "text" | "video" | "final";

export type Memory = {
  /** Defaults to "image" when omitted. */
  kind?: MemoryKind;
  /** Image source for image memories, or the poster for video memories. */
  src?: string;
  /** Video file (mp4/webm) for video memories. */
  video?: string;
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
 * One remembered moment. Renders as a framed image, a narrative interlude, a
 * cinematic video or a closing reveal, depending on its kind.
 */
export function MemoryMoment({
  memory,
  soundEnabled = false,
  fullscreen = false,
  className = "",
}: {
  memory: Memory;
  /** Ambient audio only ever plays when the visitor has already allowed sound. */
  soundEnabled?: boolean;
  /** In full-screen presentation the visual grows and the chrome recedes. */
  fullscreen?: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const kind = memory.kind ?? "image";

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

  const frame = fullscreen
    ? "aspect-[4/5] max-h-[62dvh] sm:aspect-[16/9] sm:max-h-[68dvh]"
    : "aspect-[16/10]";

  return (
    <Reveal key={memory.title} className={className}>
      <figure className={kind === "text" || kind === "final" ? "" : "glass-panel overflow-hidden rounded-sm"}>
        {kind === "video" && memory.video ? (
          <MemoryVideo
            src={memory.video}
            {...(memory.src ? { poster: memory.src } : {})}
            title={memory.title}
            className={frame}
          />
        ) : null}

        {kind === "image" && memory.src ? (
          <div className={`relative overflow-hidden ${frame}`}>
            <img
              src={memory.src}
              alt={memory.alt ?? memory.title}
              loading="lazy"
              decoding="async"
              className={fullscreen ? "h-full w-full object-contain" : "h-full w-full object-cover"}
              style={{
                animation: reduced ? undefined : "ken-burns 22s ease-in-out infinite alternate",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.07_0.03_265/0.92),oklch(0.07_0.03_265/0.18)_60%,transparent)]" />
          </div>
        ) : null}

        <figcaption
          className={
            kind === "text" || kind === "final"
              ? "px-4 py-8 text-center sm:px-10 sm:py-12"
              : "px-5 py-4 text-center sm:px-7 sm:py-5"
          }
        >
          {memory.when ? (
            <p className="text-[0.55rem] tracking-[0.4em] text-primary uppercase">{memory.when}</p>
          ) : null}
          <h3
            className={`text-gold mt-2 font-display tracking-[0.16em] uppercase ${
              kind === "final" ? "text-xl sm:text-3xl" : "text-lg sm:text-xl"
            }`}
          >
            {memory.title}
          </h3>
          <p
            className={`mt-3 leading-relaxed text-ivory/90 italic ${
              kind === "text" || kind === "final"
                ? "mx-auto max-w-xl text-base sm:text-xl"
                : "text-sm sm:text-base"
            }`}
          >
            {memory.caption}
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}
