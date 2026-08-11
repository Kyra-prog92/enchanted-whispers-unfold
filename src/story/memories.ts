import type { Memory } from "@/components/magic/MemoryMoment";
import ballroom from "@/assets/ballroom.jpg";
import lake from "@/assets/lake.jpg";
import roseTunnel from "@/assets/rose-tunnel.jpg";
import moonBridge from "@/assets/moon-bridge.jpg";

/** The remembered moments of the garden, in the order they happened. */
export const GARDEN_MEMORIES: Memory[] = [
  {
    src: ballroom,
    title: "The First Dance",
    when: "The night we met",
    caption: "Chandeliers held their breath while we forgot the rest of the world.",
    alt: "The two lovers waltzing alone beneath crystal chandeliers",
  },
  {
    src: lake,
    title: "The Quiet Lake",
    when: "The first summer",
    caption: "A hundred candles on the water, and still your eyes were the brightest light.",
    alt: "The two lovers in a lantern-lit wooden boat on a misty lake",
  },
  {
    src: roseTunnel,
    title: "The Rose Tunnel",
    when: "The long walk home",
    caption: "We walked until the petals learned our names.",
    alt: "The two lovers walking hand in hand through a glowing tunnel of roses",
  },
  {
    src: moonBridge,
    title: "The Moon Bridge",
    when: "The night you said forever",
    caption: "Above the clouds you said forever, and the wind carried it away as a promise.",
    alt: "The two lovers on a stone bridge above the clouds beneath an enormous moon",
  },
];
