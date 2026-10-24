import Link from "next/link";
import { InquiryForm } from "@/components/home/inquiry-form";
import { EventBrowser } from "@/components/events/event-browser";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { eckEvents } from "@/lib/content/events";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Events and Activities",
  description: "View verified Economic Club Karachi events and express interest in future activities.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <>
      <PageHero eyebrow="Events & activities" title="Gatherings, when confirmed." description="Find verified event details here. Dates, venues, and registration links will only appear after ECK confirms them." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><EventBrowser events={eckEvents} /></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Event interest</p><h2 className="font-display mt-4 text-3xl text-brand-purple sm:text-4xl">Ask about future activities.</h2><p className="mt-4 text-sm leading-6 text-brand-ink/65">This form records an enquiry only; it is not event registration.</p></div><InquiryForm defaultPurpose="general" defaultMessage="I would like to hear about confirmed ECK events and activities." /></div></section>
      <section className="bg-brand-purple py-12 text-white sm:py-14"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">Related</p><div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold"><Link className="underline underline-offset-4" href="/community">Community initiatives</Link><Link className="underline underline-offset-4" href="/insights">News & insights</Link><Link className="underline underline-offset-4" href="/gallery">Gallery</Link></div></div></section>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-18"><FaqAccordion items={[{ question: "Are any events currently announced?", answer: "No verified upcoming events have been supplied for publication." }, { question: "Can I register through this page?", answer: "There are no confirmed events or registration links yet. The interest form is not registration." }, { question: "Will past events be listed?", answer: "Past events will appear after ECK verifies titles, dates, and any associated imagery." }]} /></div>
    </>
  );
}
