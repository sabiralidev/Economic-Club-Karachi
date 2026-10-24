import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="bg-brand-purple text-white">
      <div className="mx-auto grid max-w-content gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-24 w-24" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            ECK&apos;s public profile describes it as a growing welfare organization. This site is a place to learn more and start a conversation.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="grid content-start gap-3 text-sm text-white/75">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Explore</p>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/about">About ECK</Link>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/events">Events & activities</Link>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/insights">Insights</Link>
        </nav>
        <nav aria-label="Contact and legal navigation" className="grid content-start gap-3 text-sm text-white/75">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Connect</p>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/contact">Contact ECK</Link>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/membership">Membership interest</Link>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/privacy">Privacy</Link>
          <Link className="w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow" href="/terms">Terms</Link>
        </nav>
        <p className="border-t border-white/15 pt-5 text-xs text-white/45 md:col-span-3">
          © {new Date().getFullYear()} Economic Club Karachi
        </p>
      </div>
    </footer>
  );
}
