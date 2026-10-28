"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Staggers the hero's `[data-hero-item]` children using a pure CSS animation.
 * No animation library is required — the delay is written to each element once.
 */
export function HeroEntrance({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>("[data-hero-item]");
    items.forEach((item, index) => {
      if (!item.style.animationDelay) item.style.animationDelay = `${index * 90}ms`;
    });
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
