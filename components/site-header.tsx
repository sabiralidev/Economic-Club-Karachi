"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

const navigation = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Business", href: "/business" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "Gallery", href: "/gallery" },
  { label: "Insights", href: "/insights" },
  { label: "Membership", href: "/membership" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="bg-brand-purple text-white">
        <div className="mx-auto flex max-w-content items-center justify-center gap-2 px-5 py-2 text-center text-xs sm:px-8 sm:text-sm">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />
          <span className="text-white/85">A growing welfare organization in Karachi</span>
        </div>
      </div>
      <header
        className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300 ease-out-soft ${
          scrolled ? "border-brand-purple/10 shadow-[0_10px_30px_-22px_rgba(33,22,47,0.5)]" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 px-5 py-3 sm:px-8">
          <Link
            aria-label="Economic Club Karachi home"
            className="flex w-fit items-center gap-3 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal-deep"
            href="/"
          >
            <BrandMark className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
          </Link>
          <button
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-brand-purple/15 px-4 text-sm font-semibold text-brand-purple transition hover:border-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal-deep xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true" className="grid gap-[3px]">
              <span className={`block h-[1.5px] w-4 bg-current transition-transform duration-200 ${menuOpen ? "translate-y-[4.5px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-4 bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[1.5px] w-4 bg-current transition-transform duration-200 ${menuOpen ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
            </span>
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav
            aria-label="Main navigation"
            className={`${
              menuOpen ? "grid" : "hidden"
            } order-3 w-full gap-1 border-t border-brand-purple/10 pb-3 pt-4 xl:order-none xl:flex xl:w-auto xl:items-center xl:gap-1 xl:border-0 xl:py-0`}
            id="primary-navigation"
          >
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`group relative rounded-sm px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal-deep ${
                    active ? "text-brand-purple" : "text-brand-ink/75 hover:text-brand-purple"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-left bg-brand-teal transition-transform duration-250 ease-out-soft ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              className={`mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-brand-purple px-6 text-sm font-semibold text-white transition hover:bg-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal-deep xl:ml-2 xl:mt-0 xl:w-auto ${
                isActive(pathname, "/contact") ? "ring-2 ring-brand-teal ring-offset-2" : ""
              }`}
              href="/contact"
            >
              Contact ECK
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
