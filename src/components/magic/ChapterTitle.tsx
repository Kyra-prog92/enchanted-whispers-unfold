import { Reveal } from "./Reveal";

export function ChapterTitle({
  chapter,
  title,
  subtitle,
}: {
  chapter: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center">
      <p className="font-display text-[0.6rem] tracking-[0.5em] text-primary uppercase sm:tracking-[0.6em]">
        {chapter}
      </p>
      <h2 className="text-gold mt-3 text-2xl leading-[1.1] tracking-[0.12em] uppercase sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="script-title mt-2 text-xl sm:text-2xl">{subtitle}</p> : null}
      <div className="mx-auto mt-5 h-px w-32 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
    </Reveal>
  );
}
