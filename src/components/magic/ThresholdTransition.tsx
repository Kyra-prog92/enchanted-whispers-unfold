import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * The crossing of the threshold: gold light blooms out of the gates, the world
 * whites over, then the light recedes into the next chapter. Not a page change —
 * a change of lighting in the same place.
 */
export function ThresholdTransition({
  active,
  onDone,
}: {
  active: boolean;
  onDone: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    setVisible(true);
    const duration = reduced ? 500 : 2200;
    const t = window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, duration);
    return () => window.clearTimeout(t);
  }, [active, reduced, onDone]);

  if (!visible) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(45%_45%_at_50%_55%,oklch(0.97_0.06_92/0.95),oklch(0.86_0.13_85/0.6)_45%,transparent_75%)]"
        style={{
          animation: reduced
            ? "light-bloom 0.5s ease-out both"
            : "threshold-bloom 2.2s var(--ease-cine) both",
        }}
      />
      <div
        className="absolute inset-0 bg-[oklch(0.06_0.02_265)]"
        style={{ animation: "light-bloom 2.2s ease-in-out both" }}
      />
    </div>
  );
}
