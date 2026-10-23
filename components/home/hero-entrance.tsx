"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export function HeroEntrance({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-hero-item]", {
          opacity: 0,
          y: 16,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
        });
      }, container);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}