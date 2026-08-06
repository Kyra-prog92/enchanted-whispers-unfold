import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Intro } from "@/components/magic/Intro";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import { CursorMagic } from "@/components/magic/CursorMagic";
import { ChapterNav } from "@/components/magic/ChapterNav";
import { useOrchestra } from "@/components/magic/useOrchestra";
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

function Index() {
  const [entered, setEntered] = useState(false);
  const { enabled, toggle, setChapter } = useOrchestra();
  const [current, setCurrent] = useState(0);

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

  const arrive = useCallback(
    (i: number) => () => {
      setCurrent(i);
      setChapter(Math.min(i, 5));
    },
    [setChapter],
  );

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

      <ChapterNav current={current} />

      <Scene
        id="gates"
        image={gates}
        alt="Giant enchanted castle gates opening in golden light"
        particles="fireflies"
        particleCount={70}
        onEnter={arrive(0)}
      >
        <ChapterTitle
          chapter="Chapter I"
          title="The Enchanted Gates"
          subtitle="moonlight, fog, and roses that waited for you"
        />
        <Reveal delay={260} className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-xl leading-relaxed text-ivory/90 italic sm:text-2xl">
            The lanterns lean toward you. The fog parts like a curtain. Somewhere beyond these
            gates, a library keeps a letter that has been waiting since before the stars learned to
            shine.
          </p>
          <a href="#letter" className="artifact-btn mt-12 inline-block px-9 py-4 text-[0.65rem]">
            Begin the Journey
          </a>
        </Reveal>
      </Scene>

      <LetterRoom onEnter={arrive(1)} />
      <MemoryGarden onEnter={arrive(2)} />
      <WishTree onEnter={arrive(3)} />
      <HiddenRealms />
      <PromiseChamber onEnter={arrive(5)} />
      <Forever onEnter={arrive(6)} />

      <footer className="relative border-t border-primary/15 py-16 text-center">
        <p className="script-title text-2xl">Forever Begins Here</p>
        <p className="mt-4 text-[0.6rem] tracking-[0.45em] text-muted-foreground/60 uppercase">
          written beneath an infinite sky
        </p>
      </footer>
    </main>
  );
}
