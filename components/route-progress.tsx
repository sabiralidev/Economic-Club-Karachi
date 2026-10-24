"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PROGRESS_STEPS = [10, 34, 58, 78, 90];

export function RouteProgress() {
  const pathname = usePathname();
  const [value, setValue] = useState(0);
  const [active, setActive] = useState(false);
  const isInitialRoute = useRef(true);
  const ticks = useRef<number[]>([]);

  useEffect(() => {
    const begin = () => {
      ticks.current.forEach(window.clearTimeout);
      ticks.current = [];
      setActive(true);
      setValue(PROGRESS_STEPS[0]);
      PROGRESS_STEPS.slice(1).forEach((step, index) => {
        ticks.current.push(window.setTimeout(() => setValue(step), 200 * (index + 1)));
      });
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      } catch {
        return;
      }
      begin();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", begin);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", begin);
      ticks.current.forEach(window.clearTimeout);
      ticks.current = [];
    };
  }, []);

  useEffect(() => {
    if (isInitialRoute.current) {
      isInitialRoute.current = false;
      return;
    }
    ticks.current.forEach(window.clearTimeout);
    ticks.current = [];
    setValue(100);
    const timer = window.setTimeout(() => {
      setActive(false);
      setValue(0);
    }, 320);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full origin-left bg-brand-teal shadow-[0_0_10px_rgba(41,198,187,0.7)] transition-[transform,opacity] duration-300 ease-out"
        style={{ opacity: active ? 1 : 0, transform: `scaleX(${value / 100})` }}
      />
    </div>
  );
}
