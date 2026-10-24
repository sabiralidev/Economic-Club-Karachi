import Link from "next/link";
import { InquiryForm } from "@/components/home/inquiry-form";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact ECK",
  description: "Send an enquiry to Economic Club Karachi about its current work or a possible collaboration.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

const topics = ["general", "membership", "partnership", "services"] as const;

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { topic } = await searchParams;
  const defaultPurpose = topics.find((value) => value === topic) ?? "general";

  return (
    <>
      <PageHero eyebrow="Contact Economic Club Karachi" title="Start with a question." description="Use the enquiry form to ask about ECK, its current work, or a possible conversation." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Contact information</p><h2 className="font-display mt-4 text-3xl text-brand-purple">Reach out online.</h2><p className="mt-4 text-base leading-7 text-brand-ink/70">An official email address, telephone number, office address, and response-time commitment have not been supplied. This form is the available contact route on this website.</p></div><div className="border-l-2 border-brand-teal pl-6"><p className="text-sm leading-6 text-brand-ink/70">The website can confirm that a form submission has been received. It cannot promise when ECK will respond.</p></div></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Choose an enquiry category</p><div className="mt-5 flex flex-wrap gap-3">{[{ value: "general", label: "General" }, { value: "membership", label: "Membership" }, { value: "partnership", label: "Partnership" }, { value: "services", label: "Service idea" }].map((item) => <Link className="rounded-full border border-brand-purple/15 px-4 py-2 text-sm font-semibold text-brand-purple hover:border-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e716b]" href={`/contact?topic=${item.value}#inquiry`} key={item.value}>{item.label}</Link>)}</div></div></section>
      <section className="bg-brand-paper py-14 sm:py-18" id="contact-form"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Business & partnership</p><h2 className="font-display mt-4 text-3xl text-brand-purple sm:text-4xl">Tell us what you would like to explore.</h2><p className="mt-4 text-sm leading-6 text-brand-ink/65">Submitting an enquiry does not imply that a service or partnership is available or agreed.</p></div><InquiryForm defaultPurpose={defaultPurpose} /></div></section>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-18"><FaqAccordion items={[{ question: "Is my enquiry sent directly to a staff member?", answer: "The form stores submissions in the configured website database for ECK review. No named recipient has been confirmed." }, { question: "Can I contact ECK through social media?", answer: "No official social profiles have been verified for publication here." }, { question: "What if the form reports an error?", answer: "The enquiry was not confirmed as received. Please try again later; no alternative verified contact detail is currently available." }]} /></div>
    </>
  );
}
