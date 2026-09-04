import type { ReactNode } from "react";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import { LetterRoom } from "@/components/chapters/LetterRoom";
import { MemoryGarden } from "@/components/chapters/MemoryGarden";
import { WishTree } from "@/components/chapters/WishTree";
import { HiddenRealms } from "@/components/chapters/HiddenRealms";
import { PromiseChamber } from "@/components/chapters/PromiseChamber";
import { Forever } from "@/components/chapters/Forever";
import { BehindTheMagic } from "@/components/chapters/BehindTheMagic";
import gates from "@/assets/gates.jpg";

/**
 * The story's single source of truth.
 *
 * A chapter is data: an id, the label the compass shows, the invitation printed on
 * the transport button, and a render function. Adding "Chapter VII" later means
 * appending one object here — no navigation, no route, no layout code to touch.
 */
export type Chapter = {
  id: string;
  /** Compass label, e.g. "I · Gates". */
  label: string;
  /** Invitation shown on the button that leads INTO the next chapter. */
  nextLabel: string;
  /** Secret/bonus chapters stay off the compass but remain part of the walk. */
  secret?: boolean;
  render: () => ReactNode;
};

function GatesChapter() {
  return (
    <Scene
      id="gates"
      image={gates}
      alt="The two lovers hand in hand before the enchanted castle gates opening in golden light"
      particles="fireflies"
      particleCount={44}
    >
      <ChapterTitle
        chapter="Chapter I"
        title="The Enchanted Gates"
        subtitle="moonlight, fog, and roses that waited for you"
      />
      <Reveal delay={260} className="mx-auto mt-7 max-w-xl text-center">
        <p className="text-base leading-relaxed text-ivory/90 italic sm:text-xl">
          The lanterns lean toward us. The fog parts like a curtain. Somewhere beyond these gates, a
          library keeps a letter that has been waiting since before the stars learned to shine.
        </p>
      </Reveal>
    </Scene>
  );
}

export const CHAPTERS: Chapter[] = [
  {
    id: "gates",
    label: "I · Gates",
    nextLabel: "Cross the courtyard to the Letter Room",
    render: () => <GatesChapter />,
  },
  {
    id: "letter",
    label: "II · Letter",
    nextLabel: "Step outside into the Memory Garden",
    render: () => <LetterRoom onEnter={undefined} />,
  },
  {
    id: "garden",
    label: "III · Garden",
    nextLabel: "Take the garden path to the Wishing Tree",
    render: () => <MemoryGarden onEnter={undefined} />,
  },
  {
    id: "wish",
    label: "IV · Wish",
    nextLabel: "Take the path the tree opened",
    render: () => <WishTree onEnter={undefined} />,
  },
  {
    id: "realms",
    label: "Interlude · Hidden Realms",
    secret: true,
    nextLabel: "Follow the light to the Promise Chamber",
    render: () => <HiddenRealms />,
  },
  {
    id: "promise",
    label: "V · Promise",
    nextLabel: "Rise into Forever",
    render: () => <PromiseChamber onEnter={undefined} />,
  },
  {
    id: "forever",
    label: "VI · Forever",
    nextLabel: "See Behind the Magic",
    render: () => <Forever onEnter={undefined} />,
  },
  {
    id: "behind",
    label: "Epilogue · Behind the Magic",
    nextLabel: "Begin our story again",
    render: () => <BehindTheMagic />,
  },
];
