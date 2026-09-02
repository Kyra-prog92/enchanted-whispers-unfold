import { useEffect, useRef, useState } from "react";
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
  const [unsealing, setUnsealing] = useState(false);
  const [sparks, setSparks] = useState<{ id: number; x: number }[]>([]);
  const sparkId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  /** Each keystroke throws a small ember above the manuscript line. */
  const onType = (value: string) => {
    setWord(value);
    setError(false);
    if (value.length > word.length) {
      const id = ++sparkId.current;
      setSparks((s) => [...s.slice(-6), { id, x: 12 + Math.random() * 76 }]);
      timers.current.push(
        window.setTimeout(() => setSparks((s) => s.filter((p) => p.id !== id)), 900),
      );
    }
  };

  const unlock = () => {
    if (word.trim().length === 0) {
      setError(true);
      timers.current.push(window.setTimeout(() => setError(false), 1400));
      return;
    }
    setError(false);
    // Cinematic beat: the seal cracks, light floods the room, then the letter unfurls.
    setUnsealing(true);
    timers.current.push(window.setTimeout(() => setOpen(true), 1800));
  };

  return (
    <Scene
      id="letter"
      image={library}
      alt="An ancient magical library with floating candles and levitating books"
      particles="dust"
      particleCount={46}
      onEnter={onEnter}
    >
      {unsealing && !open ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[90] bg-[radial-gradient(45%_45%_at_50%_50%,oklch(0.98_0.09_92/0.95),oklch(0.85_0.13_85/0.5)_45%,transparent_75%)]"
          style={{ animation: "light-bloom 1.8s var(--ease-cine) both" }}
        />
      ) : null}

      <ChapterTitle
        chapter="Chapter II"
        title="The Secret Letter Room"
        subtitle="where ink remembers everything"
      />

      {!open ? (
        <Reveal delay={200} className="mx-auto mt-8 max-w-xl text-center">
          <div
            className="parchment rounded-sm px-6 py-8 sm:px-10 sm:py-10"
            style={{
              animation: error
                ? "soft-shake 0.5s ease-in-out both"
                : "unfurl 1.4s var(--ease-cine) both",
            }}
          >
            <div className="mx-auto mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[oklch(0.45_0.08_50/0.5)]" />
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full text-[0.6rem] tracking-[0.2em]"
                style={{
                  background: "radial-gradient(circle, oklch(0.45 0.16 25), oklch(0.3 0.12 22))",
                  color: "oklch(0.94 0.04 88)",
                  animation: unsealing ? "seal-break 1.4s var(--ease-cine) both" : undefined,
                }}
              >
                ∞
              </span>
              <span className="h-px w-10 bg-[oklch(0.45_0.08_50/0.5)]" />
            </div>
            <p className="font-display text-[0.58rem] tracking-[0.4em] text-[oklch(0.36_0.09_42)] uppercase">
              A sealed manuscript
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-[oklch(0.3_0.06_40)] italic sm:text-lg">
              A treasure chest waits beneath the floating candles. Its wax seal answers only to a
              word spoken with love.
            </p>
            <div className="relative mt-7 flex flex-col items-center gap-3 sm:flex-row">
              <div className="relative w-full">
                {sparks.map((s) => (
                  <span
                    key={s.id}
                    aria-hidden
                    className="pointer-events-none absolute bottom-full h-1.5 w-1.5 rounded-full"
                    style={{
                      left: `${s.x}%`,
                      background: "oklch(0.9 0.14 80)",
                      boxShadow: "0 0 10px oklch(0.9 0.14 80)",
                      animation: "spark-rise 0.9s ease-out both",
                    }}
                  />
                ))}
                <input
                  value={word}
                  onChange={(e) => onType(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && unlock()}
                  placeholder="Speak the word…"
                  aria-label="Password to unlock the letter"
                  aria-invalid={error}
                  disabled={unsealing}
                  className="w-full border-b border-[oklch(0.45_0.09_45/0.55)] bg-transparent px-2 py-3 text-center font-body text-lg tracking-[0.2em] text-[oklch(0.26_0.06_40)] transition-all duration-500 outline-none placeholder:text-[oklch(0.45_0.05_45/0.6)] focus:border-[oklch(0.35_0.12_25)] focus:tracking-[0.3em]"
                />
              </div>
              <button
                type="button"
                onClick={unlock}
                disabled={unsealing}
                className="artifact-btn w-full shrink-0 px-8 py-3 text-[0.65rem] whitespace-nowrap sm:w-auto"
              >
                {unsealing ? "Unsealing…" : "Break the Seal"}
              </button>
            </div>
            <p aria-live="polite" className="mt-4 min-h-5 text-sm">
              {error ? (
                <span className="text-[oklch(0.42_0.17_25)]">
                  The candles dim… whisper any word you hold dear.
                </span>
              ) : (
                <span className="text-[0.65rem] tracking-[0.25em] text-[oklch(0.4_0.06_45)] uppercase">
                  Any word spoken with love will open it
                </span>
              )}
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="mx-auto mt-8 max-w-2xl">
          <div
            className="relative rounded-sm p-7 sm:p-12"
            style={{
              background:
                "linear-gradient(140deg, oklch(0.93 0.04 88 / 0.94), oklch(0.85 0.05 78 / 0.9))",
              boxShadow: "var(--shadow-royal), 0 0 90px oklch(0.82 0.13 85 / 0.35)",
              animation: "unfurl 1.8s var(--ease-cine) both",
            }}
          >
            <p className="text-center font-display text-[0.6rem] tracking-[0.4em] text-[oklch(0.35_0.09_40)] uppercase sm:text-xs">
              To the One Destiny Chose
            </p>
            <div className="mt-6 space-y-4 text-[oklch(0.28_0.06_40)]">
              {LETTER.map((line, i) => (
                <p
                  key={line}
                  className="font-body text-base leading-relaxed sm:text-lg"
                  style={{ animation: `ink-write 1.8s ease-out ${0.4 + i * 1.1}s both` }}
                >
                  {line}
                </p>
              ))}
            </div>
            <p
              className="script-title mt-8 text-right text-2xl sm:text-3xl"
              style={{
                color: "oklch(0.45 0.1 30)",
                animation: `ink-write 1.6s ease-out ${0.6 + LETTER.length * 1.1}s both`,
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
