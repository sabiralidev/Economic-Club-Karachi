import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { EventSummary } from "@/lib/content/database";

export function EventsSection({ events, unavailable = false }: { events: EventSummary[]; unavailable?: boolean }) {
  const hasSample = events.some((event) => event.id.startsWith("sample-"));

  return (
    <section className="bg-brand-paper py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <ScrollReveal>
          <SectionHeading
            actions={
              <Link className="link-underline text-sm font-bold text-brand-purple" href="/events">
                All events &amp; activities
                <span aria-hidden="true" className="ml-1">↗</span>
              </Link>
            }
            className="[&>div:last-child]:pb-1"
            eyebrow="Events & activities"
            title="Gatherings, when confirmed."
          />

          {hasSample && (
            <div className="mt-8" data-reveal>
              <SampleContentNotice />
            </div>
          )}

          {unavailable ? (
            <div className="mt-10" data-reveal>
              <EmptyState
                description="We could not load published events. Please try again shortly."
                title="Events are temporarily unavailable"
              />
            </div>
          ) : events.length ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <Card className="group overflow-hidden" data-reveal interactive key={event.id}>
                  {event.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        alt={event.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        src={event.image}
                        unoptimized={event.image.startsWith("https://")}
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-teal-deep">
                      {new Date(event.startDate).toLocaleDateString()}
                      {event.id.startsWith("sample-") ? " · Sample" : ""}
                    </p>
                    <h3 className="font-display mt-3 text-xl leading-snug text-brand-purple sm:text-2xl">{event.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-brand-ink/70">{event.summary}</p>
                    <Link
                      className="link-underline mt-5 inline-flex text-sm font-bold text-brand-purple"
                      href={`/events/${event.slug}`}
                    >
                      Event details
                      <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">↗</span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-10" data-reveal>
              <EmptyState
                description="Verified events will appear here after ECK publishes their details."
                href="/events"
                linkLabel="Browse events"
                title="No upcoming events announced"
              />
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
