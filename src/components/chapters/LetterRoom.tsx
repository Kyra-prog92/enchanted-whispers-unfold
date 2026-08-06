import { useState } from "react";
import { Scene } from "@/components/magic/Scene";
import { ChapterTitle } from "@/components/magic/ChapterTitle";
import { Reveal } from "@/components/magic/Reveal";
import library from "@/assets/library.jpg";

const LETTER = [
  "Long before the stars learned to shine, before the moon whispered to the sea, there was a promise waiting patiently through time.",
  "It waited through every sunrise and every quiet night until the day our paths finally crossed.",
  "If you are reading these words, then every step, every coincidence, every heartbeat has brought you exactly where you were always meant to be.",
  "You are not simply part of my story. You are the reason it exists.",
  "So tonight, beneath this endless sky, I invite you to walk with me through the memories we have created and the dreams we have yet to discover.",
  "Welcome home.",
];

export function LetterRoom({ onEnter }: { onEnter?: (() => void) | undefined }) {
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState("");
  const [error, setError] = useState(false);

  const unlock = () => {
    if (word.trim().length === 0) {
      setError(true);
      return;
    }
    setError(false);
    setOpen(true);
  };

  return (
    <Scene
      id="letter"
      image={library}
      alt="An ancient magical library with floating candles and levitating books"
      particles="dust"
      particleCount={70}
      onEnter={onEnter}
    >
      <ChapterTitle
        chapter="Chapter II"
        title="The Secret Letter Room"
        subtitle="where ink remembers everything"
      />

      {!open ? (
        <Reveal delay={200} className="mx-auto mt-14 max-w-xl text-center">
          <div className="glass-panel rounded-sm p-10">
            <p className="text-lg text-muted-foreground italic">
              A treasure chest waits beneath the floating candles. Its wax seal answers only to a
              word.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && unlock()}
                placeholder="Speak the word…"
                aria-label="Password to unlock the letter"
                className="w-full border-b border-primary/40 bg-transparent px-2 py-3 text-center font-body text-lg tracking-[0.2em] text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary"
              />
              <button type="button" onClick={unlock} className="artifact-btn w-full px-8 py-3 text-[0.65rem] sm:w-auto">
                Break the Seal
              </button>
            </div>
            {error ? (
              <p className="mt-4 text-sm text-accent">
                The candles dim… whisper any word you hold dear.
              </p>
            ) : (
              <p className="mt-4 text-xs tracking-[0.25em] text-muted-foreground/70 uppercase">
                Any word spoken with love will open it
              </p>
            )}
          </div>
        </Reveal>
      ) : (
        <div className="mx-auto mt-14 max-w-3xl">
          <div
            className="relative rounded-sm p-10 sm:p-14"
            style={{
              background:
                "linear-gradient(140deg, oklch(0.93 0.04 88 / 0.94), oklch(0.85 0.05 78 / 0.9))",
              boxShadow: "var(--shadow-royal), 0 0 90px oklch(0.82 0.13 85 / 0.35)",
              animation: "rise-in 1.6s var(--ease-cine) both",
            }}
          >
            <p className="text-center font-display text-xs tracking-[0.45em] text-[oklch(0.35_0.09_40)] uppercase">
              To the One Destiny Chose
            </p>
            <div className="mt-8 space-y-5 text-[oklch(0.28_0.06_40)]">
              {LETTER.map((line, i) => (
                <p
                  key={line}
                  className="font-body text-lg leading-relaxed sm:text-xl"
                  style={{ animation: `ink-write 2.4s ease-out ${1 + i * 1.5}s both` }}
                >
                  {line}
                </p>
              ))}
            </div>
            <p
              className="script-title mt-10 text-right text-3xl"
              style={{
                color: "oklch(0.45 0.1 30)",
                animation: `ink-write 2s ease-out ${1 + LETTER.length * 1.5}s both`,
              }}
            >
              always yours
            </p>
          </div>
        </div>
      )}
    </Scene>
  );
}