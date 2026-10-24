"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  animateSections?: boolean;
};

export function ScrollReveal({ children, className, animateSections = false }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || (animateSections && pathname === "/")) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = animateSections
        ? Array.from(container.querySelectorAll<HTMLElement>(":scope > section, :scope > article, :scope > header"))
        : gsap.utils.toArray<HTMLElement>("[data-reveal]", container);

      elements.forEach((element, index) => {
        gsap.from(element, {
          opacity: 0,
          y: 20,
          delay: index * 0.06,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });
    });

    return () => media.revert();
  }, [animateSections, pathname]);

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}
