import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { EmptyState } from "@/components/public/empty-state";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About ECK",
  description: "Learn what is currently known about Economic Club Karachi and what remains for the organization to confirm.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About ECK" title="A growing welfare organization in Karachi." description="A clear introduction to what is known today, with the organization's deeper story still being confirmed." />
      <section className="bg-brand-paper py-16 sm:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Organization overview</p>
            <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight text-brand-purple sm:text-4xl">An introduction grounded in what ECK has shared.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-brand-ink/75">Economic Club Karachi&apos;s public profile describes it as a growing welfare organization. Its organizational history, leadership, communities served, and current programmes have not yet been independently confirmed for this website.</p>
          </div>
          <aside className="border-l-2 border-brand-teal pl-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0e716b]">Editorial status</p>
            <p className="mt-3 text-base leading-7 text-brand-ink/75">The mission, vision, and values below are proposed prompts for ECK review, not approved organizational statements.</p>
          </aside>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Purpose · proposed for review</p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <article className="border-t-2 border-brand-purple/15 pt-6">
              <h2 className="font-display text-3xl text-brand-purple">Mission</h2>
              <p className="mt-4 text-base leading-7 text-brand-ink/70">A draft prompt: how might ECK describe the welfare work it exists to do, and the people or communities it intends to serve?</p>
            </article>
            <article className="border-t-2 border-brand-teal pt-6">
              <h2 className="font-display text-3xl text-brand-purple">Vision</h2>
              <p className="mt-4 text-base leading-7 text-brand-ink/70">A draft prompt: what long-term change does ECK hope to contribute to in Karachi, and how will it define meaningful progress?</p>
            </article>
          </div>
        </div>
      </section>
      <section className="bg-brand-paper py-16 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Core values · discussion prompts</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Listening", "Transparency", "Respect", "Shared responsibility"].map((value) => (
              <article className="border border-brand-purple/10 bg-white p-6" key={value}>
                <h2 className="text-lg font-semibold text-brand-purple">{value}</h2>
                <p className="mt-2 text-sm leading-6 text-brand-ink/65">A suggested value for client discussion, not a verified ECK commitment.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Business & community orientation</p>
            <h2 className="font-display mt-4 text-3xl leading-tight text-brand-purple sm:text-4xl">Different perspectives belong in the same conversation.</h2>
          </div>
          <p className="text-base leading-7 text-brand-ink/70">ECK&apos;s public identity includes the words “Economic Club,” while its public profile describes a welfare organization. How these aspects relate should be explained by ECK itself; this site does not infer a business model or a confirmed service offering.</p>
        </div>
      </section>
      <section className="bg-brand-paper py-16 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Initiatives & activities</p>
          <h2 className="font-display mt-4 text-3xl leading-tight text-brand-purple sm:text-4xl">ECK&apos;s current work is being confirmed.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-brand-ink/70">We will publish activity descriptions only after ECK confirms their purpose, status, and participation details.</p>
          <div className="mt-8"><EmptyState title="No verified initiatives published yet" description="Contact ECK for current information about its work and how to express interest." href="/contact#inquiry" linkLabel="Contact ECK" /></div>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Milestones</p>
            <h2 className="font-display mt-4 text-3xl leading-tight text-brand-purple sm:text-4xl">A timeline needs verified dates.</h2>
          </div>
          <EmptyState title="No milestones confirmed" description="Founding dates, awards, impact numbers, and other historical claims will be added only after ECK verifies them." />
        </div>
      </section>
      <FaqAccordion items={[
        { question: "What is Economic Club Karachi?", answer: "ECK's public profile describes it as a growing welfare organization in Karachi. Further organizational details are awaiting confirmation." },
        { question: "What initiatives does ECK run?", answer: "Current initiatives have not been verified for this website. Please contact ECK for up-to-date information." },
      ]} />
      <section className="bg-brand-purple py-14 text-white sm:py-16">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">Continue the conversation</p><h2 className="font-display mt-3 text-3xl">Ask ECK about its current work.</h2></div>
          <Link className="inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-brand-teal px-6 py-3 text-sm font-bold text-brand-purple" href="/contact#inquiry">Contact ECK</Link>
        </div>
      </section>
    </>
  );
}
