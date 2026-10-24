import { notFound } from "next/navigation";
import Image from "next/image";
import { InquiryForm } from "@/components/home/inquiry-form";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { eckEvents } from "@/lib/content/events";
import { pageMetadata } from "@/lib/seo";

type EventPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = eckEvents.find((item) => item.slug === slug);
  return event ? pageMetadata({ title: event.title, description: event.summary, path: `/events/${event.slug}` }) : { title: "Event not found" };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = eckEvents.find((item) => item.slug === slug);
  if (!event) notFound();

  return (
    <>
      <section className="bg-brand-purple py-10 text-white sm:py-14">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: event.title }]} />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">{event.status} · {event.category}</p>
          <h1 className="font-display mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">{event.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{event.summary}</p>
        </div>
      </section>
      <article className="bg-brand-paper py-14 sm:py-18">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            {event.image && <div className="relative mb-8 aspect-[16/9] overflow-hidden"> <Image alt={event.imageAlt ?? ""} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 60vw" src={event.image} /></div>}
            <div className="space-y-5 text-base leading-7 text-brand-ink/75">{event.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <aside className="h-fit border border-brand-purple/10 bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0e716b]">Event information</p>
            {event.date && <p className="mt-4 text-sm text-brand-ink/75"><strong className="text-brand-purple">Date:</strong> {event.date}</p>}
            {event.location && <p className="mt-3 text-sm text-brand-ink/75"><strong className="text-brand-purple">Location:</strong> {event.location}</p>}
            <p className="mt-4 text-xs leading-5 text-brand-ink/55">An enquiry is not event registration. ECK must confirm availability and participation details.</p>
            <div className="mt-6"><InquiryForm defaultPurpose="general" defaultMessage={`I would like information about the ECK event: ${event.title}.`} /></div>
          </aside>
        </div>
      </article>
    </>
  );
}
