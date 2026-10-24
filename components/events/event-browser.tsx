import Image from "next/image";
import Link from "next/link";
import { ContentPagination } from "@/components/public/content-pagination";
import { EmptyState } from "@/components/public/empty-state";
import type { EventSummary, PageResult, PublicPageQuery } from "@/lib/content/database";

type EventBrowserProps = {
  result: PageResult<EventSummary>;
  query: PublicPageQuery;
  unavailable?: boolean;
};

export function EventBrowser({ result, query, unavailable = false }: EventBrowserProps) {
  return (
    <div>
      <form action="/events" className="grid gap-3 border-b border-brand-purple/10 pb-5 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1 text-xs font-semibold text-brand-purple">Event period
          <select className="min-h-11 border border-brand-purple/20 bg-white px-3 text-sm" defaultValue={query.status ?? "upcoming"} name="status">
            <option value="upcoming">Upcoming</option><option value="past">Past</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-brand-purple">Search
          <input className="min-h-11 border border-brand-purple/20 bg-white px-3 text-sm" defaultValue={query.q} maxLength={100} name="q" placeholder="Event title or topic" type="search" />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-brand-purple">Category
          <input className="min-h-11 border border-brand-purple/20 bg-white px-3 text-sm" defaultValue={query.category} maxLength={80} name="category" placeholder="Any category" />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-brand-purple">Starts after
          <input className="min-h-11 border border-brand-purple/20 bg-white px-3 text-sm" defaultValue={query.from} name="from" type="date" />
        </label>
        <div className="flex items-end gap-3"><label className="grid flex-1 gap-1 text-xs font-semibold text-brand-purple">Starts before
          <input className="min-h-11 border border-brand-purple/20 bg-white px-3 text-sm" defaultValue={query.to} name="to" type="date" />
        </label><button className="min-h-11 rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white" type="submit">Filter</button></div>
      </form>
      {unavailable ? <div className="mt-7"><EmptyState title="Events are temporarily unavailable" description="We could not load published events. Please try again shortly." /></div>
        : result.items.length === 0 ? <div className="mt-7"><EmptyState title={query.status === "past" ? "No past events published" : "No upcoming events announced"} description="ECK has not supplied verified event details for this selection. Events will appear once they are published." href="/contact?topic=general#inquiry" linkLabel="Ask about activities" /></div>
          : <div className="mt-7 grid gap-5 md:grid-cols-2">
            {result.items.map((event) => <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" key={event.id}>
              {event.image && <div className="relative aspect-[16/9]"><Image alt={event.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={event.image} unoptimized={event.image.startsWith("https://")} /></div>}
              <div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0e716b]">{event.category ? `${event.category} · ` : ""}{event.status} · {new Date(event.startDate).toLocaleDateString()}</p><h2 className="mt-3 text-xl font-semibold text-brand-purple">{event.title}</h2><p className="mt-3 text-sm leading-6 text-brand-ink/70">{event.summary}</p><Link className="mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/events/${event.slug}`}>Event details <span aria-hidden="true" className="ml-2">↗</span></Link></div>
            </article>)}
          </div>}
      {!unavailable && <ContentPagination pathname="/events" page={result.page} pages={result.pages} query={query} />}
    </div>
  );
}
