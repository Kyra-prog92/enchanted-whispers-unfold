import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import observatory from "@/assets/observatory.jpg";

const NOTES = [
  {
    heading: "Project vision",
    body: "A love letter you can walk through. The web treated as a stage rather than a document: a kingdom that opens for one visitor at a time and remembers them while they're inside it.",
  },
  {
    heading: "Technologies",
    body: "React 19 + TypeScript on TanStack Start, Tailwind CSS v4 design tokens, hand-written Canvas 2D particle systems, an HTMLAudio soundtrack layer with fades, and IntersectionObserver-driven reveals.",
  },
  {
    heading: "Interaction design",
    body: "Interaction as narration. Nothing appears without being invited: the visitor crosses a threshold of light, breaks a wax seal, walks a timeline, chooses the next chapter. Motion carries meaning instead of decoration.",
  },
  {
    heading: "Engineering challenges",
    body: "Cinematic atmosphere at 60fps — one canvas per scene, particle counts halved on small screens, pointer parallax throttled to a single animation frame, transforms kept on the compositor, and audio that never sounds before a gesture.",
  },
  {
    heading: "What I learned",
    body: "Emotional pacing is an engineering problem. Timing, easing and restraint changed how the story felt far more than any added effect, and the accessibility work — contrast, focus rings, reduced motion — made it better for everyone.",
  },
  {
    heading: "Future possibilities",
    body: "Chapters are data now: one object in the story registry adds a room to the kingdom, and memories are a reusable component with image, date, narration and optional ambience. Next: WebGL depth, spoken narration, and a memory a visitor can leave behind.",
  },
];

/** Portfolio epilogue: the human-computer interaction thinking behind the fantasy. */
export function BehindTheMagic() {
  return (
    <Scene
      id="behind"
      image={observatory}
      alt="An ancient observatory where the constellations rearrange themselves"
      particles="dust"
      particleCount={36}
      rays={false}
    >
      <ChapterTitle
        chapter="Epilogue"
        title="Behind the Magic"
        subtitle="how the kingdom was built"
      />

      <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-2">
        {NOTES.map((n, i) => (
          <Reveal key={n.heading} delay={i * 120}>
            <article className="glass-panel h-full rounded-sm p-5">
              <h3 className="text-gold font-display text-[0.6rem] tracking-[0.34em] uppercase">
                {n.heading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/85">{n.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={520} className="mt-6 text-center">
        <p className="text-[0.55rem] tracking-[0.4em] text-muted-foreground uppercase">
          An interaction design study in storytelling, motion and sound
        </p>
      </Reveal>
    </Scene>
  );
}
