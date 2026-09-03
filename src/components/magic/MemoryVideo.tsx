import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * A cinematic video memory. Never autoplays with sound: playback begins only on
 * a deliberate press, and the surrounding atmosphere stays out of the frame.
 *
 * The poster holds the frame before playback, so nothing shifts when the file
 * finally arrives — and if it never arrives, the moment degrades to a still.
 */
export function MemoryVideo({
  src,
  poster,
  title,
  className = "",
}: {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
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
    <div className={`relative overflow-hidden rounded-sm ${className}`}>
      {/* Poster underlay keeps the frame filled before the first frame decodes. */}
      {poster ? (
        <img
          src={poster}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      ) : null}

      <video
        ref={ref}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        muted={muted}
        aria-label={title}
        className="relative h-full w-full bg-[oklch(0.07_0.03_265)] object-contain transition-opacity duration-[900ms]"
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
        <div className="absolute inset-0 flex items-end justify-center bg-[oklch(0.07_0.03_265/0.5)] p-6">
          <p className="text-center text-[0.6rem] tracking-[0.3em] text-ivory/80 uppercase">
            This moment is resting — the film will not play here
          </p>
        </div>
      ) : !playing ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play the memory: ${title}`}
          className="absolute inset-0 flex items-center justify-center bg-[oklch(0.07_0.03_265/0.35)] transition-colors duration-500 hover:bg-[oklch(0.07_0.03_265/0.18)] focus-visible:bg-[oklch(0.07_0.03_265/0.18)] focus-visible:outline-none"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border text-primary transition-transform duration-500 hover:scale-105"
            style={{ borderColor: "oklch(0.85 0.14 85 / 0.7)", boxShadow: "var(--glow-gold)" }}
          >
            {loading ? "…" : "▶"}
          </span>
        </button>
      ) : null}

      {!failed ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-[oklch(0.07_0.03_265/0.9)] to-transparent px-4 pt-8 pb-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
            className="min-h-11 text-[0.6rem] tracking-[0.3em] text-ivory/90 uppercase transition-colors hover:text-primary focus-visible:text-primary"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <div
            role="progressbar"
            aria-label="Video progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-px flex-1 bg-[oklch(0.85_0.14_85/0.25)]"
          >
            <div
              className="h-px transition-[width] duration-200"
              style={{ width: `${progress}%`, background: "oklch(0.85 0.14 85 / 0.9)" }}
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
            className="min-h-11 text-[0.6rem] tracking-[0.3em] text-ivory/90 uppercase transition-colors hover:text-primary focus-visible:text-primary"
          >
            {muted ? "Sound Off" : "Sound On"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
