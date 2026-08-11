import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Intro } from "@/components/magic/Intro";
import { CursorMagic } from "@/components/magic/CursorMagic";
import { ChapterNav } from "@/components/magic/ChapterNav";
import { ThresholdTransition } from "@/components/magic/ThresholdTransition";
import { useSoundtrack } from "@/components/magic/useSoundtrack";
import { CHAPTERS } from "@/story/chapters";

const TITLE = "Forever Begins Here — An Enchanted Cinematic Love Story";
const DESCRIPTION =
  "Step through the enchanted gates into a moonlit kingdom: a secret letter room, a memory garden, the wishing tree, the promise chamber, and a sky where our story never ends.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);
  const [crossing, setCrossing] = useState(false);
  const { enabled, toggle } = useSoundtrack();
  const [step, setStep] = useState(0);

  // Crossing the threshold: light blooms out of the gates, then Chapter I is there.
  const enter = useCallback(() => {
    setCrossing(true);
    if (!enabled) toggle();
  }, [enabled, toggle]);

  const finishCrossing = useCallback(() => {
    setCrossing(false);
    setEntered(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  const go = useCallback((i: number) => {
    setStep(((i % CHAPTERS.length) + CHAPTERS.length) % CHAPTERS.length);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Keyboard navigation: arrows walk the journey once the kingdom is entered.
  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, go, step]);

  const chapters = [
  const chapter = CHAPTERS[step]!;

  return (
    <main className="relative">
      <CursorMagic />
      {!entered ? <Intro onEnter={enter} /> : null}
      <ThresholdTransition active={crossing} onDone={finishCrossing} />

      {entered ? (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={enabled ? "Mute the soundtrack" : "Play the soundtrack"}
        className="glass-panel fixed top-4 right-4 z-[75] flex min-h-11 items-center gap-3 rounded-full px-4 py-3 text-[0.55rem] tracking-[0.3em] uppercase transition-transform duration-500 hover:-translate-y-0.5 sm:top-5 sm:right-5 sm:px-5 sm:text-[0.6rem]"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: enabled ? "oklch(0.85 0.14 85)" : "oklch(0.55 0.03 265)",
            boxShadow: enabled ? "var(--glow-gold)" : "none",
            animation: enabled ? "soft-pulse 2.6s ease-in-out infinite" : undefined,
          }}
        />
        {enabled ? "Music On" : "Music Off"}
      </button>
      ) : null}

      {entered ? <ChapterNav current={step} onJump={go} /> : null}

      <div key={chapter.id} style={{ animation: "rise-in 1.4s var(--ease-cine) both" }}>
        {chapter.render()}
      </div>

      {/* Chapter transport — the journey advances by choice, never by scrolling. */}
      {entered ? (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 bg-gradient-to-t from-[oklch(0.06_0.02_265/0.94)] via-[oklch(0.06_0.02_265/0.6)] to-transparent px-5 pt-12 pb-5 sm:gap-3 sm:pt-16 sm:pb-7">
        <button
          type="button"
          onClick={() => go(step + 1)}
          className="artifact-btn pointer-events-auto max-w-[92vw] overflow-hidden px-6 py-3.5 text-[0.55rem] sm:px-8 sm:py-4 sm:text-[0.62rem]"
        >
          {chapter.nextLabel}
        </button>
        <div className="pointer-events-auto flex items-center gap-5 text-[0.55rem] tracking-[0.35em] text-muted-foreground uppercase">
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="min-h-11 px-2 transition-colors hover:text-primary"
          >
            ← Back
          </button>
          <span className="text-primary">
            {step + 1} / {CHAPTERS.length}
          </span>
        </div>
      </div>
      ) : null}

      <footer className="relative border-t border-primary/15 py-10 pb-36 text-center">
        <p className="script-title text-xl">Forever Begins Here</p>
        <p className="mt-3 text-[0.55rem] tracking-[0.4em] text-muted-foreground uppercase">
          written beneath an infinite sky
        </p>
      </footer>
    </main>
  );
}
