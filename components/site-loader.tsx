"use client";

import { useEffect, useState } from "react";

const MINIMUM_VISIBLE_MS = 500;
const HARD_TIMEOUT_MS = 8000;
const EXIT_DURATION_MS = 500;

export function SiteLoader() {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    const timers: number[] = [];
    let frame = 0;
    let released = false;

    const release = () => {
      if (released) return;
      released = true;
      const remaining = Math.max(0, MINIMUM_VISIBLE_MS - (Date.now() - startedAt));
      timers.push(
        window.setTimeout(() => {
          setLeaving(true);
          timers.push(window.setTimeout(() => setHidden(true), EXIT_DURATION_MS));
        }, remaining),
      );
    };

    if (document.readyState === "complete") {
      frame = window.requestAnimationFrame(release);
    } else {
      window.addEventListener("load", release);
      timers.push(window.setTimeout(release, HARD_TIMEOUT_MS));
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", release);
      timers.forEach(window.clearTimeout);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center gap-7 bg-brand-purple transition-opacity duration-500 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
    >
      <span className="sr-only">Loading Economic Club Karachi</span>
      <div className="relative grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 rounded-full border border-white/10" />
        <span className="absolute inset-0 animate-[eck-spin_1.05s_linear_infinite] rounded-full border-2 border-transparent border-t-brand-teal" />
        <span className="font-display text-2xl tracking-tight text-white">ECK</span>
      </div>
      <div className="h-px w-44 overflow-hidden bg-white/15">
        <span className="eck-loader-sweep block h-full w-1/3 bg-brand-teal" />
      </div>
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-white/45">
        Economic Club Karachi
      </span>
    </div>
  );
}
