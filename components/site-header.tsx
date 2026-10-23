import Link from "next/link";
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
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-brand-purple/10 bg-white">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link
          aria-label="Economic Club Karachi home"
          className="flex w-fit items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
          href="/"
        >
          <BrandMark />
          <span className="leading-tight">
            <span className="block text-sm font-bold uppercase tracking-[0.16em] text-brand-purple">
              Economic Club
            </span>
            <span className="block text-xs font-medium tracking-[0.22em] text-brand-ink/65">
              KARACHI
            </span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          {navigation.map((item) => (
            <Link
              className="rounded-sm py-1 text-sm font-medium text-brand-ink/75 transition-colors hover:text-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
