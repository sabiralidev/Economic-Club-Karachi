import Link from "next/link";
import { EventBrowser } from "@/components/events/event-browser";
import { InquiryForm } from "@/components/home/inquiry-form";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { listEvents, type PublicPageQuery } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Events and Activities",
  description: "View verified Economic Club Karachi events and express interest in future activities.",
  path: "/events",
});

type EventsPageProps = { searchParams: Promise<PublicPageQuery> };

const relatedLinks = [
  { href: "/community", label: "Community initiatives" },
  { href: "/insights", label: "News & insights" },
  { href: "/gallery", label: "Gallery" },
];

const faqs = [
  { question: "Are any events currently announced?", answer: "No verified upcoming events have been supplied for publication." },
  { question: "Can I register through this page?", answer: "There are no confirmed events or registration links yet. The interest form is not registration." },
  { question: "Will past events be listed?", answer: "Past events will appear after ECK verifies titles, dates, and any associated imagery." },
];

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const query = await searchParams;
  let unavailable = false;
  let result;
  try {
    result = await listEvents(query);
  } catch {
    unavailable = true;
    result = { items: [], page: 1, limit: 12, total: 0, pages: 0 };
  }

  return (
    <>
      <PageHero
        description="Find events published by ECK. Venue details only appear when verified by the organization."
        eyebrow="Events & activities"
        title="Gatherings, when confirmed."
      />

      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <EventBrowser query={query} result={result} unavailable={unavailable} />
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Event interest</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.1] text-brand-purple sm:text-4xl">
              Ask about future activities.
            </h2>
            <p className="lead mt-5 max-w-md">
              This form records an enquiry only; it is not event registration.
            </p>
          </div>
          <InquiryForm defaultMessage="I would like to hear about confirmed ECK events and activities." defaultPurpose="general" />
        </div>
      </section>

      <section className="mesh-dark py-12 text-white sm:py-14">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <p className="eyebrow eyebrow-on-dark">Related</p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            {relatedLinks.map((link) => (
              <Link className="link-underline" key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20">
        <FaqAccordion items={faqs} />
      </div>
    </>
  );
}
