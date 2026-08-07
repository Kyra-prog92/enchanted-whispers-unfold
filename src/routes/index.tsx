import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Intro } from "@/components/magic/Intro";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import { CursorMagic } from "@/components/magic/CursorMagic";
import { ChapterNav, CHAPTERS } from "@/components/magic/ChapterNav";
import { useSoundtrack } from "@/components/magic/useSoundtrack";
import { LetterRoom } from "@/components/chapters/LetterRoom";
import { MemoryGarden } from "@/components/chapters/MemoryGarden";
import { WishTree } from "@/components/chapters/WishTree";
import { HiddenRealms } from "@/components/chapters/HiddenRealms";
import { PromiseChamber } from "@/components/chapters/PromiseChamber";
import { Forever } from "@/components/chapters/Forever";
import gates from "@/assets/gates.jpg";

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

const NEXT_LABEL = [
  "Enter the Letter Room",
  "Walk into the Memory Garden",
  "Follow us to the Wishing Tree",
  "Open the Hidden Realms",
  "Step into the Promise Chamber",
  "Rise into Forever",
  "Begin our story again",
];

function Index() {
  const [entered, setEntered] = useState(false);
  const { enabled, toggle } = useSoundtrack();
  const [step, setStep] = useState(0);

  const enter = useCallback(() => {
    setEntered(true);
    if (!enabled) toggle();
  }, [enabled, toggle]);

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

  const chapters = [
    <Scene
      key="gates"
      id="gates"
      image={gates}
      alt="The two lovers hand in hand before the enchanted castle gates opening in golden light"
      particles="fireflies"
      particleCount={70}
    >
      <ChapterTitle
        chapter="Chapter I"
        title="The Enchanted Gates"
        subtitle="moonlight, fog, and roses that waited for you"
      />
      <Reveal delay={260} className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-xl leading-relaxed text-ivory/90 italic sm:text-2xl">
          The lanterns lean toward us. The fog parts like a curtain. Somewhere beyond these gates, a
          library keeps a letter that has been waiting since before the stars learned to shine.
        </p>
      </Reveal>
    </Scene>,
    <LetterRoom key="letter" onEnter={undefined} />,
    <MemoryGarden key="garden" onEnter={undefined} />,
    <WishTree key="wish" onEnter={undefined} />,
    <HiddenRealms key="realms" />,
    <PromiseChamber key="promise" onEnter={undefined} />,
    <Forever key="forever" onEnter={undefined} />,
  ];

  return (
    <main className="relative">
      <CursorMagic />
      {!entered ? <Intro onEnter={enter} /> : null}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        className="glass-panel fixed top-5 right-5 z-[75] flex items-center gap-3 rounded-full px-5 py-3 text-[0.6rem] tracking-[0.32em] uppercase transition-transform duration-500 hover:-translate-y-0.5"
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

      <ChapterNav current={step} onJump={go} />

      <div key={step} style={{ animation: "rise-in 1.4s var(--ease-cine) both" }}>
        {chapters[step]}
      </div>

      {/* Chapter transport — the journey advances by choice, never by scrolling. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-3 bg-gradient-to-t from-[oklch(0.06_0.02_265/0.92)] via-[oklch(0.06_0.02_265/0.6)] to-transparent px-6 pt-16 pb-7">
        <button
          type="button"
          onClick={() => go(step + 1)}
          className="artifact-btn pointer-events-auto px-8 py-4 text-[0.62rem]"
        >
          {NEXT_LABEL[step]}
        </button>
        <div className="pointer-events-auto flex items-center gap-5 text-[0.55rem] tracking-[0.4em] text-muted-foreground/70 uppercase">
          <button
            type="button"
            onClick={() => go(step - 1)}
            className="transition-colors hover:text-primary"
          >
            ← Back
          </button>
          <span className="text-primary/70">
            {step + 1} / {CHAPTERS.length}
          </span>
        </div>
      </div>

      <footer className="relative border-t border-primary/15 py-16 pb-40 text-center">
        <p className="script-title text-2xl">Forever Begins Here</p>
        <p className="mt-4 text-[0.6rem] tracking-[0.45em] text-muted-foreground/60 uppercase">
          written beneath an infinite sky
        </p>
      </footer>
    </main>
  );
}
