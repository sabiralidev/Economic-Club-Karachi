"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/public/empty-state";
import type { ECKEvent, EventCategory, EventStatus } from "@/lib/content/events";

type EventBrowserProps = {
  events: ECKEvent[];
};

const categoryOptions: { label: string; value: EventCategory | "all" }[] = [
  { label: "All topics", value: "all" },
  { label: "Community", value: "community" },
  { label: "Business", value: "business" },
];

export function EventBrowser({ events }: EventBrowserProps) {
  const [status, setStatus] = useState<EventStatus>("upcoming");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const visibleEvents = events.filter((event) => event.status === status && (category === "all" || event.category === category));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-brand-purple/10 pb-5">
        <div aria-label="Event time period" className="inline-flex rounded-sm border border-brand-purple/15 p-1" role="group">
          {(["upcoming", "past"] as const).map((item) => (
            <button aria-pressed={status === item} className={`min-h-10 px-4 text-sm font-semibold capitalize transition ${status === item ? "bg-brand-purple text-white" : "text-brand-ink/65 hover:text-brand-purple"}`} key={item} onClick={() => setStatus(item)} type="button">{item} events</button>
          ))}
        </div>
        <div aria-label="Filter events by proposed topic" className="flex flex-wrap gap-2" role="group">
          {categoryOptions.map((option) => (
            <button aria-pressed={category === option.value} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${category === option.value ? "border-brand-purple bg-brand-purple text-white" : "border-brand-purple/15 text-brand-ink/70 hover:border-brand-purple"}`} key={option.value} onClick={() => setCategory(option.value)} type="button">{option.label}</button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-brand-ink/55">Topic labels are provisional and should be confirmed with ECK.</p>
      {visibleEvents.length === 0 ? (
        <div className="mt-7"><EmptyState title={status === "upcoming" ? "No upcoming events announced" : "No past events published"} description="ECK has not supplied verified event details for this page. Dates, locations, and registration links will appear here after confirmation." href="/contact?topic=general#inquiry" linkLabel="Ask about activities" /></div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {visibleEvents.map((event) => (
            <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" key={event.slug}>
              {event.image && <div className="relative aspect-[16/9]"><Image alt={event.imageAlt ?? ""} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={event.image} /></div>}
              <div className="p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0e716b]">{event.category}{event.date ? ` · ${event.date}` : ""}</p><h3 className="mt-3 text-xl font-semibold text-brand-purple">{event.title}</h3><p className="mt-3 text-sm leading-6 text-brand-ink/70">{event.summary}</p><Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/events/${event.slug}`}>Event details <span aria-hidden="true" className="ml-2">↗</span></Link></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}