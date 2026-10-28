import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InquiryForm } from "@/components/home/inquiry-form";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { getEventBySlug } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

type EventPageProps = { params: Promise<{ slug: string }> };

const loadEvent = cache(async (slug: string) => getEventBySlug(slug));

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  return event
    ? pageMetadata({ title: event.seo?.title ?? event.title, description: event.seo?.description ?? event.summary, path: `/events/${event.slug}` })
    : { title: "Event not found" };
}

const statusTones = {
  upcoming: "teal",
  past: "neutral",
  cancelled: "danger",
} as const;

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) notFound();

  const acceptingRegistration = event.registration.enabled && event.status === "upcoming" && new Date(event.startDate) > new Date();
  const facts = [
    { label: "Date", value: new Date(event.startDate).toLocaleString() },
    ...(event.endDate ? [{ label: "Ends", value: new Date(event.endDate).toLocaleString() }] : []),
    ...(event.venue ? [{ label: "Venue", value: event.venue }] : []),
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Events", href: "/events" }, { label: event.title }]}
        description={event.summary}
        eyebrow={`${event.category ? `${event.category} · ` : ""}${event.status}${event.id.startsWith("sample-") ? " · Sample" : ""}`}
        notice={event.id.startsWith("sample-") ? <SampleContentNotice /> : undefined}
        title={event.title}
      />

      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <article className="min-w-0">
            {event.image && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-brand-purple/10 bg-white">
                <Image
                  alt={event.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={event.image}
                  unoptimized={event.image.startsWith("https://")}
                />
              </div>
            )}
            <div className="whitespace-pre-line text-base leading-8 text-brand-ink/75">{event.description}</div>
          </article>

          <aside className="h-fit border border-brand-purple/10 bg-white p-6 sm:p-8 lg:sticky lg:top-32">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">Event information</p>
              <Badge square tone={statusTones[event.status]}>{event.status}</Badge>
            </div>
            <dl className="mt-5 grid gap-4">
              {facts.map((fact) => (
                <div className="border-t border-brand-purple/10 pt-4 first:border-0 first:pt-0" key={fact.label}>
                  <dt className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">{fact.label}</dt>
                  <dd className="mt-1 text-sm text-brand-ink/80">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-l-2 border-brand-teal bg-brand-purple/[0.04] px-3 py-2 text-xs leading-5 text-brand-ink/60">
              {acceptingRegistration
                ? "Registration requests are stored for ECK review; submission does not guarantee a place."
                : "Registration is not currently enabled for this event."}
            </p>
            <div className="mt-6">
              <InquiryForm
                {...(acceptingRegistration ? { eventSlug: event.slug } : { defaultPurpose: "general" })}
                defaultMessage={`I would like information about the ECK event: ${event.title}.`}
              />
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pb-16 sm:px-8">
        <Link className="link-underline text-sm font-bold text-brand-purple" href="/events">
          <span aria-hidden="true" className="mr-1">←</span> Back to events
        </Link>
      </div>
    </>
  );
}
