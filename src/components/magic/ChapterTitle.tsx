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
      <p className="font-display text-[0.68rem] tracking-[0.62em] text-primary/80 uppercase">
        {chapter}
      </p>
      <h2 className="text-gold mt-5 text-4xl leading-[1.05] tracking-[0.14em] uppercase sm:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="script-title mt-4 text-2xl sm:text-3xl">{subtitle}</p>
      ) : null}
      <div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
    </Reveal>
  );
}