import { InquiryForm } from "@/components/home/inquiry-form";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { EmptyState } from "@/components/public/empty-state";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Membership",
  description: "Express interest in Economic Club Karachi and ask about current participation options.",
  path: "/membership",
});

export default function MembershipPage() {
  return (
    <>
      <PageHero eyebrow="Membership & participation" title="Begin with an expression of interest." description="Share what you would like to learn about ECK. No membership tier, eligibility rule, or benefit has been confirmed." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Introduction</p><h2 className="font-display mt-4 text-3xl text-brand-purple sm:text-4xl">A first step, not an application decision.</h2></div><p className="text-base leading-7 text-brand-ink/70">This form lets you express interest and ask for current information. It does not create membership or guarantee acceptance, benefits, or a follow-up timeline.</p></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Ways to express interest · for discussion</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[{ title: "Learn about ECK", text: "Ask about the organization and its current work." }, { title: "Explore participation", text: "Ask whether there are current ways to get involved." }, { title: "Discuss partnership", text: "Share an idea for ECK to review." }].map((item) => <article className="border-t-2 border-brand-purple/15 bg-brand-paper p-6" key={item.title}><h2 className="text-lg font-semibold text-brand-purple">{item.title}</h2><p className="mt-3 text-sm leading-6 text-brand-ink/70">{item.text}</p></article>)}</div></div></section>
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Eligibility & benefits</p><h2 className="font-display mt-4 text-3xl text-brand-purple">No membership policy has been supplied.</h2><p className="mt-4 text-sm leading-6 text-brand-ink/65">ECK should confirm its membership model, eligibility, fees, benefits, and any participation requirements before those details are published.</p></div><EmptyState title="Details pending ECK confirmation" description="Submit an expression of interest to ask about current arrangements." /></div></section>
      <section className="bg-brand-purple py-14 text-white sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">What happens next · proposed flow</p><ol className="mt-7 grid gap-6 md:grid-cols-3">{["Share your interest and question.", "ECK reviews the enquiry.", "The organization can provide current details if available."].map((step, index) => <li className="border-t border-white/20 pt-4" key={step}><span className="font-display text-2xl text-brand-teal">0{index + 1}</span><p className="mt-3 text-sm leading-6 text-white/80">{step}</p></li>)}</ol><p className="mt-5 text-xs text-white/55">This describes the enquiry flow only, not a formal application or guaranteed response time.</p></div></section>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-18"><FaqAccordion items={[{ question: "Is this a membership application?", answer: "No. It is an expression of interest. ECK has not provided an approved application process." }, { question: "Are there membership tiers or benefits?", answer: "No tiers, eligibility rules, benefits, or fees have been verified for this website." }, { question: "When will ECK respond?", answer: "Response time has not been confirmed. The form shows whether your enquiry was received by the website." }]} /></div>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Expression of interest</p><h2 className="font-display mt-4 text-3xl text-brand-purple sm:text-4xl">Tell us what you would like to know.</h2><p className="mt-4 text-sm leading-6 text-brand-ink/65">Please avoid sharing sensitive personal or financial information.</p></div><InquiryForm application /></div></section>
    </>
  );
}
