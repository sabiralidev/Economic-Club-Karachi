import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/home/inquiry-form";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { getEventBySlug } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

type EventPageProps = { params: Promise<{ slug: string }> };

async function loadEvent(slug: string) {
  return getEventBySlug(slug);
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  return event
    ? pageMetadata({ title: event.seo?.title ?? event.title, description: event.seo?.description ?? event.summary, path: `/events/${event.slug}` })
    : { title: "Event not found" };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await loadEvent(slug);
  if (!event) notFound();
  const acceptingRegistration = event.registration.enabled && event.status === "upcoming" && new Date(event.startDate) > new Date();
  return (
    <>
      <section className="bg-brand-purple py-10 text-white sm:py-14"><div className="mx-auto max-w-content px-5 sm:px-8"><Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: event.title }]} /><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">{event.status}</p><h1 className="font-display mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">{event.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{event.summary}</p></div></section>
      <article className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>{event.image && <div className="relative mb-8 aspect-[16/9] overflow-hidden"><Image alt={event.title} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 60vw" src={event.image} unoptimized={event.image.startsWith("https://")} /></div>}<div className="whitespace-pre-line text-base leading-8 text-brand-ink/75">{event.description}</div></div>
        <aside className="h-fit border border-brand-purple/10 bg-white p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0e716b]">Event information</p><p className="mt-4 text-sm text-brand-ink/75"><strong className="text-brand-purple">Date:</strong> {new Date(event.startDate).toLocaleString()}</p>{event.endDate && <p className="mt-3 text-sm text-brand-ink/75"><strong className="text-brand-purple">Ends:</strong> {new Date(event.endDate).toLocaleString()}</p>}{event.venue && <p className="mt-3 text-sm text-brand-ink/75"><strong className="text-brand-purple">Venue:</strong> {event.venue}</p>}<p className="mt-4 text-xs leading-5 text-brand-ink/55">{acceptingRegistration ? "Registration requests are stored for ECK review; submission does not guarantee a place." : "Registration is not currently enabled for this event."}</p><div className="mt-6"><InquiryForm {...(acceptingRegistration ? { eventSlug: event.slug } : { defaultPurpose: "general" })} defaultMessage={`I would like information about the ECK event: ${event.title}.`} /></div></aside>
      </div></article>
      <div className="mx-auto max-w-content px-5 py-8 sm:px-8"><Link className="text-sm font-bold text-brand-purple underline" href="/events">← Back to events</Link></div>
    </>
  );
}
