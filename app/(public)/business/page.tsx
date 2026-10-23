import Link from "next/link";

export const metadata = { title: "Business and Entrepreneurship" };

export default function BusinessPage() {
  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Business & dialogue</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-brand-purple sm:text-6xl">Bring a question worth discussing.</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <div className="space-y-5 text-base leading-7 text-brand-ink/75">
            <p>Economic Club Karachi&apos;s confirmed services, business programmes and participation model have not yet been provided.</p>
            <p>This page is a starting point for people and organizations who want to ask ECK about its current work, propose a discussion, or explore whether a collaboration may be appropriate.</p>
          </div>
          <div className="border-t-2 border-brand-purple/15 bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0e716b]">For discussion</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-brand-ink/70">
              <li>What questions are important to your organization?</li>
              <li>What would you like to learn from a local conversation?</li>
              <li>Is there an idea you would like ECK to consider?</li>
            </ul>
            <Link className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b]" href="/contact?topic=partnership#inquiry">Start a conversation</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
