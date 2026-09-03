import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * A cinematic video memory. It behaves like a living photograph: muted, looping
 * playback begins on its own where the browser allows it, and the controls stay
 * out of the frame until the visitor reaches for them.
 *
 * The poster holds the frame before playback, so nothing shifts when the file
 * finally arrives — and if it never arrives, the moment degrades to a still.
 */
export function MemoryVideo({
  src,
  poster,
  title,
  autoPlay = true,
  loop = true,
  fullscreen = false,
  className = "",
}: {
  src: string;
  poster?: string;
  title: string;
  /** Muted autoplay only — sound is never forced on the visitor. */
  autoPlay?: boolean;
  loop?: boolean;
  fullscreen?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // A new memory always starts at rest.
    setPlaying(false);
    setProgress(0);
    setReady(false);
    setFailed(false);
  }, [src]);

  // Living-photograph behaviour: muted autoplay where permitted, never with sound,
  // and never when the visitor has asked for reduced motion.
  useEffect(() => {
    const el = ref.current;
    if (!el || !autoPlay || reduced || !ready || failed) return;
    el.muted = true;
    void el
      .play()
      .then(() => setPlaying(true))
      .catch(() => undefined);
  }, [autoPlay, reduced, ready, failed]);

  const toggle = () => {
    const el = ref.current;
    if (!el || failed) return;
    if (el.paused) {
      setLoading(true);
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => setFailed(true))
        .finally(() => setLoading(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {/* Poster underlay keeps the frame filled before the first frame decodes. */}
      {poster ? (
        <img
          src={poster}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      ) : null}

      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        loop={loop}
        muted={muted}
        aria-label={title}
        className={`relative h-full w-full bg-[oklch(0.07_0.03_265)] transition-opacity duration-[1200ms] ${
          fullscreen ? "object-contain sm:object-cover" : "object-cover"
        }`}
        style={{ opacity: failed ? 0 : ready ? 1 : reduced ? 1 : 0 }}
        onLoadedData={() => setReady(true)}
        onError={() => setFailed(true)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgress((el.currentTime / el.duration) * 100);
        }}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onEnded={() => setPlaying(false)}
      />

      {failed ? (
        <div className="absolute inset-0 flex items-end justify-center p-6">
          <p className="text-center text-[0.6rem] tracking-[0.3em] text-ivory/80 uppercase">
            This moment is resting — the film will not play here
          </p>
        </div>
      ) : !playing ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play the memory: ${title}`}
          className="absolute inset-0 flex items-center justify-center transition-colors duration-500 focus-visible:outline-none"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border text-primary transition-transform duration-500 hover:scale-105"
            style={{ borderColor: "oklch(0.85 0.14 85 / 0.6)", boxShadow: "var(--glow-gold)" }}
          >
            {loading ? "…" : "▶"}
          </span>
        </button>
      ) : null}

      {/* The controls stay out of the frame until reached for. */}
      {!failed ? (
        <div className="absolute inset-x-0 top-0 flex items-center gap-3 px-5 pt-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
            className="min-h-11 text-[0.55rem] tracking-[0.3em] text-ivory/85 uppercase transition-colors hover:text-primary focus-visible:text-primary"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <div
            role="progressbar"
            aria-label="Video progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-px flex-1 bg-[oklch(0.85_0.14_85/0.2)]"
          >
            <div
              className="h-px transition-[width] duration-200"
              style={{ width: `${progress}%`, background: "oklch(0.85 0.14 85 / 0.85)" }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const el = ref.current;
              const next = !muted;
              setMuted(next);
              if (el) el.muted = next;
            }}
            aria-pressed={muted}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="min-h-11 text-[0.55rem] tracking-[0.3em] text-ivory/85 uppercase transition-colors hover:text-primary focus-visible:text-primary"
          >
            {muted ? "Sound Off" : "Sound On"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
