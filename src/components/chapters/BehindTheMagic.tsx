import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import observatory from "@/assets/observatory.jpg";

const NOTES = [
  {
    heading: "Technologies",
    body: "React + TypeScript on TanStack Start, Tailwind CSS v4 design tokens, hand-written Canvas 2D particle systems, the Web Audio-backed HTMLAudio layer, and IntersectionObserver-driven reveals.",
  },
  {
    heading: "Design philosophy",
    body: "Interaction as narration. Nothing appears without being invited: the visitor breaks a seal, walks a timeline, chooses the next chapter. Motion carries meaning instead of decoration.",
  },
  {
    heading: "Challenges solved",
    body: "Cinematic atmosphere at 60fps — one shared canvas per scene, particle counts halved on small screens, transforms kept on the compositor, and audio that never autoplays before a gesture.",
  },
  {
    heading: "Lessons learned",
    body: "Emotional pacing is an engineering problem. Timing, easing and restraint changed how the story felt far more than any extra effect, and accessibility work (contrast, focus rings, reduced motion) made it better for everyone.",
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