import { ContentCard } from "@/components/public/content-card";
import { ContentPagination } from "@/components/public/content-pagination";
import { EmptyState } from "@/components/public/empty-state";
import { FilterBar } from "@/components/public/filter-bar";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { Field, Input, Select } from "@/components/ui/field";
import type { EventSummary, PageResult, PublicPageQuery } from "@/lib/content/database";

type EventBrowserProps = {
  result: PageResult<EventSummary>;
  query: PublicPageQuery;
  unavailable?: boolean;
};

export function EventBrowser({ query, result, unavailable = false }: EventBrowserProps) {
  const hasSample = result.items.some((event) => event.id.startsWith("sample-"));

  return (
    <div>
      {hasSample && (
        <div className="mb-7">
          <SampleContentNotice />
        </div>
      )}

      <FilterBar
        action="/events"
        layout="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        submitLabel="Filter"
      >
        <Field id="events-status" label="Event period">
          <Select defaultValue={query.status ?? "upcoming"} id="events-status" name="status">
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </Select>
        </Field>
        <Field id="events-search" label="Search">
          <Input
            defaultValue={query.q}
            id="events-search"
            maxLength={100}
            name="q"
            placeholder="Event title or topic"
            type="search"
          />
        </Field>
        <Field id="events-category" label="Category">
          <Input
            defaultValue={query.category}
            id="events-category"
            maxLength={80}
            name="category"
            placeholder="Any category"
          />
        </Field>
        <Field id="events-from" label="Starts after">
          <Input defaultValue={query.from} id="events-from" name="from" type="date" />
        </Field>
        <Field id="events-to" label="Starts before">
          <Input defaultValue={query.to} id="events-to" name="to" type="date" />
        </Field>
      </FilterBar>

      {unavailable ? (
        <div className="mt-7">
          <EmptyState
            description="We could not load published events. Please try again shortly."
            title="Events are temporarily unavailable"
          />
        </div>
      ) : result.items.length === 0 ? (
        <div className="mt-7">
          <EmptyState
            description="ECK has not supplied verified event details for this selection. Events will appear once they are published."
            href="/contact?topic=general#inquiry"
            linkLabel="Ask about activities"
            title={query.status === "past" ? "No past events published" : "No upcoming events announced"}
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {result.items.map((event) => (
            <ContentCard
              description={event.summary}
              href={`/events/${event.slug}`}
              image={event.image}
              key={event.id}
              linkLabel="Event details"
              meta={[
                event.category,
                event.status,
                new Date(event.startDate).toLocaleDateString(),
                event.id.startsWith("sample-") ? "Sample" : null,
              ].filter(Boolean).join(" · ")}
              title={event.title}
            />
          ))}
        </div>
      )}

      {!unavailable && (
        <ContentPagination page={result.page} pages={result.pages} pathname="/events" query={query} />
      )}
    </div>
  );
}
