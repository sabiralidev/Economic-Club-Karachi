import Link from "next/link";
import { InquiryForm } from "@/components/home/inquiry-form";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { engagementSteps, proposedServices } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: "Explore proposed service themes for review and ask Economic Club Karachi about its current work.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services · proposed concepts" title="Explore what useful engagement might look like." description="The themes below are working concepts for ECK review, not official services or current programmes." />
      <section className="bg-brand-paper py-14 sm:py-18">
        <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Overview</p><h2 className="font-display mt-4 text-3xl leading-tight text-brand-purple sm:text-4xl">Start with the question, then confirm the fit.</h2></div>
          <div className="space-y-4 text-base leading-7 text-brand-ink/70"><p>These proposed concepts describe possible ways to structure a conversation or explore a community question. ECK has not confirmed that it provides these services.</p><p>They are written to help visitors describe what they need while the organization reviews its public information.</p></div>
        </div>
      </section>
      <section className="bg-white py-12">
        <nav aria-label="Service categories" className="mx-auto flex max-w-content flex-wrap gap-3 px-5 sm:px-8">
          {proposedServices.map((service) => <a className="rounded-full border border-brand-purple/15 px-4 py-2 text-sm font-semibold text-brand-purple hover:border-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e716b]" href={`#${service.slug}`} key={service.slug}>{service.category}</a>)}
        </nav>
      </section>
      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Proposed service themes</p><h2 className="font-display mt-4 text-3xl text-brand-purple sm:text-4xl">Concepts for review, not confirmed offers.</h2></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {proposedServices.map((service) => (
              <article className="home-card flex flex-col border border-brand-purple/10 bg-white p-6 sm:p-7" id={service.slug} key={service.slug}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">{service.category}</p>
                <h3 className="mt-3 text-xl font-semibold text-brand-purple">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/70">{service.overview}</p>
                <p className="mt-5 border-t border-brand-purple/10 pt-4 text-sm leading-6 text-brand-ink/65"><strong className="text-brand-purple">Potential outcome:</strong> {service.outcome}</p>
                <Link className="editorial-link mt-5 inline-flex w-fit text-sm font-bold text-brand-purple underline" href={`/services/${service.slug}`}>View proposed detail <span aria-hidden="true" className="ml-2">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-purple py-14 text-white sm:py-18">
        <div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">How engagement could work</p><h2 className="font-display mt-4 text-3xl sm:text-4xl">A clear process before any commitment.</h2><ol className="mt-8 grid gap-6 md:grid-cols-3">{engagementSteps.map((step, index) => <li className="border-t border-white/20 pt-4 text-base leading-7 text-white/80" key={step}><span className="font-display text-2xl text-brand-teal">0{index + 1}</span><p className="mt-3">{step}</p></li>)}</ol></div>
      </section>
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Illustrative scenarios · not ECK case studies</p><div className="mt-6 grid gap-5 md:grid-cols-2"><article className="border border-brand-purple/10 p-6"><h2 className="text-lg font-semibold text-brand-purple">A community question</h2><p className="mt-3 text-sm leading-6 text-brand-ink/70">A group wants to understand different views on a local issue. A discussion outline and listening format could be explored if ECK agrees.</p></article><article className="border border-brand-purple/10 p-6"><h2 className="text-lg font-semibold text-brand-purple">A business topic</h2><p className="mt-3 text-sm leading-6 text-brand-ink/70">Several organizations share a question. A focused conversation could be proposed, subject to ECK review and participant consent.</p></article></div></div>
      </section>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-18"><FaqAccordion items={[
        { question: "Are these official ECK services?", answer: "No. These concepts are provisional and require ECK approval before being presented as actual offerings." },
        { question: "Are there fees or eligibility requirements?", answer: "No pricing or eligibility policy has been confirmed. Ask ECK about current arrangements." },
        { question: "What happens after I submit an enquiry?", answer: "The enquiry is stored for ECK review. Response times and follow-up arrangements have not been confirmed." },
      ]} /></div>
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Discuss an idea</p><h2 className="font-display mt-4 text-3xl leading-tight text-brand-purple sm:text-4xl">Tell ECK what you have in mind.</h2><p className="mt-4 text-sm leading-6 text-brand-ink/65">Submitting an enquiry does not imply that a service is available or agreed.</p></div><InquiryForm defaultPurpose="services" /></div></section>
    </>
  );
}
