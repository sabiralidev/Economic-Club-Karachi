import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const exploreLinks = [
  { label: "About ECK", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Business & entrepreneurship", href: "/business" },
  { label: "Events & activities", href: "/events" },
];

const programmeLinks = [
  { label: "Community & initiatives", href: "/community" },
  { label: "Gallery", href: "/gallery" },
  { label: "News & insights", href: "/insights" },
  { label: "Membership interest", href: "/membership" },
];

const connectLinks = [
  { label: "Contact ECK", href: "/contact" },
  { label: "Privacy notice", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title} className="grid content-start gap-3 text-sm text-white/75">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{title}</p>
      {links.map((link) => (
        <Link
          className="link-underline w-fit hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mesh-dark text-white">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:py-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-sm bg-white/95 p-2">
              <BrandMark className="h-16 w-16 object-contain" />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              ECK&apos;s public profile describes it as a growing welfare organization. This site is a
              place to learn more and start a conversation.
            </p>
            <Link
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-white"
              href="/contact#inquiry"
            >
              Start a conversation
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <FooterColumn links={exploreLinks} title="Explore" />
          <FooterColumn links={programmeLinks} title="Programmes" />
          <FooterColumn links={connectLinks} title="Connect" />
        </div>
        <div className="flex flex-col gap-4 border-t border-white/15 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Economic Club Karachi. All rights reserved.</p>
          <p className="text-white/40">
            Content marked as sample or proposed is for demonstration and awaits confirmation from ECK.
          </p>
        </div>
      </div>
    </footer>
  );
}
