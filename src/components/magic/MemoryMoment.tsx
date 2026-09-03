import { useEffect, useRef } from "react";
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
  /** Video memories only: begin muted playback as soon as the frame is ready. */
  autoPlay?: boolean;
  /** Video memories only: loop the clip like a living photograph. */
  loop?: boolean;
};

/**
 * One remembered moment, staged as a full cinematic frame rather than a card.
 *
 * The media fills the stage; the words live inside the same frame and arrive a
 * beat later, so the visitor reads the picture first and the story second.
 * Entrances and exits are film edits — crossfade, drift, and a breath of blur.
 */
export function MemoryMoment({
  memory,
  soundEnabled = false,
  fullscreen = false,
  exiting = false,
  /** Direction of the cut: +1 moving later in the story, -1 moving earlier. */
  direction = 1,
  className = "",
}: {
  memory: Memory;
  /** Ambient audio only ever plays when the visitor has already allowed sound. */
  soundEnabled?: boolean;
  /** In full-screen presentation the visual grows and the chrome recedes. */
  fullscreen?: boolean;
  /** True while this moment is leaving the stage. */
  exiting?: boolean;
  direction?: 1 | -1;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const kind = memory.kind ?? "image";
  const narrative = kind === "text" || kind === "final";

  useEffect(() => {
    if (!memory.ambient || !soundEnabled || exiting) return;
    const el = new Audio(memory.ambient);
    el.loop = true;
    el.volume = 0.18;
    audioRef.current = el;
    void el.play().catch(() => undefined);
    return () => {
      el.pause();
      audioRef.current = null;
    };
  }, [memory.ambient, soundEnabled, exiting]);

  const hasMedia = kind === "video" ? Boolean(memory.video) : Boolean(memory.src);

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      aria-hidden={exiting ? true : undefined}
      style={{
        // A film edit, not a swap: the leaving frame drifts away as the new one arrives.
        ["--mem-dx" as string]: `${direction * 2.4}%`,
        animation: reduced
          ? undefined
          : exiting
            ? "memory-out 0.85s var(--ease-cine) both"
            : "memory-in 1.25s var(--ease-cine) both",
      }}
    >
      {kind === "video" && memory.video ? (
        <MemoryVideo
          src={memory.video}
          {...(memory.src ? { poster: memory.src } : {})}
          title={memory.title}
          autoPlay={memory.autoPlay ?? true}
          loop={memory.loop ?? true}
          fullscreen={fullscreen}
          className="absolute inset-0 h-full w-full"
        />
      ) : null}

      {(kind === "image" || kind === "final") && memory.src ? (
        <img
          src={memory.src}
          alt={memory.alt ?? memory.title}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full ${
            fullscreen ? "object-contain sm:object-cover" : "object-cover"
          }`}
          style={{
            animation: reduced
              ? undefined
              : `ken-burns ${kind === "final" ? "34s" : "26s"} ease-in-out infinite alternate`,
          }}
        />
      ) : null}

      {/* Narrative interludes have no picture — only moonlight and words. */}
      {!hasMedia ? (
        <>
          <span aria-hidden className="fog-layer" />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(58% 46% at 50% 46%, oklch(0.86 0.05 88 / 0.12), transparent 72%)",
            }}
          />
        </>
      ) : null}

      {hasMedia ? <span aria-hidden className="memory-veil" /> : null}
      {kind === "final" && !reduced ? <span aria-hidden className="memory-glow" /> : null}

      <figure
        className={`absolute inset-x-0 ${
          narrative && !hasMedia
            ? "top-1/2 -translate-y-1/2 px-6 text-center sm:px-16"
            : "bottom-0 px-6 pb-8 text-center sm:px-12 sm:pb-12"
        }`}
      >
        <figcaption>
          {memory.when ? (
            <p
              className="text-[0.55rem] tracking-[0.45em] text-primary/85 uppercase"
              style={{
                animation: reduced ? undefined : "caption-rise 1s var(--ease-cine) 0.35s both",
              }}
            >
              {memory.when}
            </p>
          ) : null}
          <h3
            className={`text-gold mt-3 font-display tracking-[0.18em] uppercase ${
              kind === "final"
                ? "text-xl sm:text-3xl"
                : fullscreen
                  ? "text-lg sm:text-2xl"
                  : "text-lg sm:text-xl"
            }`}
            style={{
              animation: reduced ? undefined : "caption-rise 1.1s var(--ease-cine) 0.55s both",
            }}
          >
            {memory.title}
          </h3>
          <span
            aria-hidden
            className="mx-auto mt-4 block h-px w-20 bg-[linear-gradient(to_right,transparent,oklch(0.85_0.14_85/0.75),transparent)]"
            style={{
              animation: reduced ? undefined : "caption-rise 1.1s var(--ease-cine) 0.7s both",
            }}
          />
          <p
            className={`mx-auto leading-relaxed text-ivory/90 italic ${
              narrative && !hasMedia
                ? "mt-6 max-w-xl text-base sm:text-xl"
                : "mt-4 max-w-lg text-sm sm:text-base"
            }`}
            style={{
              animation: reduced ? undefined : "caption-rise 1.2s var(--ease-cine) 0.85s both",
            }}
          >
            {memory.caption}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
