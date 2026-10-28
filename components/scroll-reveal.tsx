"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { observeReveal } from "@/components/reveal";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Reveal direct section/article/header children instead of `[data-reveal]` nodes. */
  animateSections?: boolean;
};

export function ScrollReveal({ children, className, animateSections = false }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const selector = animateSections
      ? ":scope > section, :scope > article, :scope > header"
      : "[data-reveal]";
    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (elements.length === 0) return;

    const cleanups = elements.map((element, index) =>
      observeReveal(element, Math.min(index, 6) * 70),
    );

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [animateSections]);

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}
