import type { Memory } from "@/components/magic/MemoryMoment";
import ballroom from "@/assets/ballroom.jpg";
import lake from "@/assets/lake.jpg";
import roseTunnel from "@/assets/rose-tunnel.jpg";
import moonBridge from "@/assets/moon-bridge.jpg";
import observatory from "@/assets/observatory.jpg";

/**
 * The remembered moments of the garden, in the order they happened.
 *
 * The sequence is deliberately uneven: images, a narrative interlude, and a
 * closing reveal, so the walk feels like a story rather than a gallery.
 *
 * To add a video memory, drop the file in the project and append:
 *   { kind: "video", video: myClip, src: posterImage, title: "...", caption: "..." }
 */
export const GARDEN_MEMORIES: Memory[] = [
  {
    kind: "image",
    src: ballroom,
    title: "The First Dance",
    when: "The night we met",
    caption: "Chandeliers held their breath while we forgot the rest of the world.",
    alt: "The two lovers waltzing alone beneath crystal chandeliers",
  },
  {
    kind: "image",
    src: lake,
    title: "The Quiet Lake",
    when: "The first summer",
    caption: "A hundred candles on the water, and still your eyes were the brightest light.",
    alt: "The two lovers in a lantern-lit wooden boat on a misty lake",
  },
  {
    kind: "text",
    title: "An Interlude",
    when: "Between two seasons",
    caption:
      "There is a hallway inside every love where nothing happens and everything changes. We walked it slowly, and when we came out the other side we were no longer two travellers — we were one road.",
  },
  {
    kind: "image",
    src: roseTunnel,
    title: "The Rose Tunnel",
    when: "The long walk home",
    caption: "We walked until the petals learned our names.",
    alt: "The two lovers walking hand in hand through a glowing tunnel of roses",
  },
  {
    kind: "image",
    src: moonBridge,
    title: "The Moon Bridge",
    when: "The night you said forever",
    caption: "Above the clouds you said forever, and the wind carried it away as a promise.",
    alt: "The two lovers on a stone bridge above the clouds beneath an enormous moon",
  },
  {
    kind: "final",
    src: observatory,
    title: "And The Garden Keeps It All",
    when: "The last flower on the path",
    caption:
      "Every moment we lived is still growing here — quietly, patiently, waiting for us to come back and read it again.",
    alt: "The two lovers beneath a glass observatory dome full of stars",
  },
];
