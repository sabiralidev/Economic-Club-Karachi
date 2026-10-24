"use client";

import Link from "next/link";
import { useState } from "react";
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

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-brand-purple text-white">
        <div className="mx-auto flex max-w-content items-center justify-center px-5 py-2 text-center text-xs sm:px-8 sm:text-sm">
          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-brand-teal" />
          A growing welfare organization in Karachi
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-brand-purple/10 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 px-5 py-4 sm:px-8">
          <Link
            aria-label="Economic Club Karachi home"
            className="flex w-fit items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b]"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            <BrandMark className="h-20 w-20" />
          </Link>
          <button
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            className="rounded-md border border-brand-purple/15 px-4 py-2 text-sm font-semibold text-brand-purple transition hover:border-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e716b] xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav
            aria-label="Main navigation"
            className={`${menuOpen ? "grid" : "hidden"} order-3 w-full gap-1 border-t border-brand-purple/10 pt-3 xl:order-none xl:flex xl:w-auto xl:items-center xl:gap-4 xl:border-0 xl:pt-0`}
            id="primary-navigation"
          >
            {navigation.map((item) => (
              <Link
                className="rounded-sm py-2 text-sm font-medium text-brand-ink/75 transition-colors hover:text-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e716b] xl:py-1"
                href={item.href}
                key={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="mt-1 inline-flex w-fit items-center justify-center rounded-md bg-brand-purple px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e716b] xl:mt-0"
              href="/contact"
              onClick={() => setMenuOpen(false)}
            >
              Contact ECK
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
