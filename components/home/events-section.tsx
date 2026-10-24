import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { EventSummary } from "@/lib/content/database";

export function EventsSection({ events, unavailable = false }: { events: EventSummary[]; unavailable?: boolean }) {
  return (
    <section className="bg-brand-paper py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8"><ScrollReveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Events & activities</p><h2 className="font-display max-w-2xl text-4xl leading-tight text-brand-purple sm:text-5xl">Gatherings, when confirmed.</h2></div>
          <Link className="w-fit text-sm font-bold text-brand-purple underline" href="/events">All events & activities <span aria-hidden="true" className="ml-1">↗</span></Link>
        </div>
        {unavailable ? <div className="mt-8" data-reveal><EmptyState title="Events are temporarily unavailable" description="We could not load published events. Please try again shortly." /></div> : events.length ? <div className="mt-12 grid gap-6 md:grid-cols-2">{events.map((event) => <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" data-reveal key={event.id}>
          {event.image && <div className="relative aspect-[16/9] overflow-hidden"><Image alt={event.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={event.image} unoptimized={event.image.startsWith("https://")} /></div>}
          <div className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0e716b]">{new Date(event.startDate).toLocaleDateString()}</p><h3 className="mt-3 text-xl font-semibold text-brand-purple">{event.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-brand-ink/70">{event.summary}</p><Link className="mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/events/${event.slug}`}>Event details <span aria-hidden="true" className="ml-1">↗</span></Link></div>
        </article>)}</div> : <div className="mt-8" data-reveal><EmptyState title="No upcoming events announced" description="Verified events will appear here after ECK publishes their details." href="/events" linkLabel="Browse events" /></div>}
      </ScrollReveal></div>
    </section>
  );
}
