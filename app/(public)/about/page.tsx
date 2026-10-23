import Link from "next/link";

export const metadata = { title: "About ECK" };

export default function AboutPage() {
  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">About ECK</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-brand-purple sm:text-6xl">A growing welfare organization in Karachi.</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="space-y-5 text-base leading-7 text-brand-ink/75">
            <p>Economic Club Karachi&apos;s public profile describes it as a growing welfare organization.</p>
            <p>Further details about its mission, history, leadership, programmes and communities served are being confirmed with ECK. This page will be updated as approved information becomes available.</p>
          </div>
          <aside className="border-l-2 border-brand-teal pl-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0e716b]">In the meantime</p>
            <p className="mt-3 text-base leading-7 text-brand-ink/75">Ask ECK directly about its current work or share an idea you would like to discuss.</p>
            <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href="/contact#inquiry">Contact ECK <span aria-hidden="true" className="ml-2">↗</span></Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
