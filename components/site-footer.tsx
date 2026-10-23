import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="bg-brand-purple text-white">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark />
            <p className="font-semibold">Economic Club Karachi</p>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            A platform for ideas, connections, and economic opportunity in Karachi.
          </p>
        </div>
        <nav aria-label="Legal navigation" className="flex gap-5 text-sm text-white/75">
          <Link className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal" href="/terms">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
