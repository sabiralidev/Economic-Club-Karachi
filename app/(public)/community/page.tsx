import Link from "next/link";

export const metadata = { title: "Community and Initiatives" };

export default function CommunityPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Community</p>
          <h1 className="font-display max-w-xl text-4xl leading-tight text-brand-purple sm:text-6xl">Community work starts by listening.</h1>
        </div>
        <div className="space-y-5 text-base leading-7 text-brand-ink/75">
          <p>ECK&apos;s public profile describes it as a growing welfare organization. Details about its current community initiatives, partners and participation options have not yet been verified.</p>
          <p>This page will share approved information when it is available. In the meantime, community members and organizations can contact ECK to ask about current work or suggest a conversation.</p>
          <Link className="editorial-link inline-flex text-sm font-bold text-brand-purple underline" href="/contact?topic=partnership#inquiry">Share an idea <span aria-hidden="true" className="ml-2">↗</span></Link>
        </div>
      </div>
    </section>
  );
}
