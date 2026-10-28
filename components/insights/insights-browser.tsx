import { ContentCard } from "@/components/public/content-card";
import { ContentPagination } from "@/components/public/content-pagination";
import { EmptyState } from "@/components/public/empty-state";
import { FilterBar } from "@/components/public/filter-bar";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { Field, Input } from "@/components/ui/field";
import type { ArticleSummary, PageResult, PublicPageQuery } from "@/lib/content/database";

type InsightsBrowserProps = {
  result: PageResult<ArticleSummary>;
  query: PublicPageQuery;
  unavailable?: boolean;
};

export function InsightsBrowser({ query, result, unavailable = false }: InsightsBrowserProps) {
  const hasSample = result.items.some((article) => article.id.startsWith("sample-"));

  return (
    <>
      <FilterBar
        action="/insights"
        layout="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr]"
        submitLabel="Search"
      >
        <Field id="insights-search" label="Search articles">
          <Input
            defaultValue={query.q}
            id="insights-search"
            maxLength={100}
            name="q"
            placeholder="Search by title or topic"
            type="search"
          />
        </Field>
        <Field id="insights-category" label="Category">
          <Input
            defaultValue={query.category}
            id="insights-category"
            maxLength={80}
            name="category"
            placeholder="All categories"
          />
        </Field>
      </FilterBar>

      {hasSample && (
        <div className="mt-7">
          <SampleContentNotice />
        </div>
      )}

      {unavailable ? (
        <div className="mt-7">
          <EmptyState
            description="We could not load published articles. Please try again shortly."
            title="Articles are temporarily unavailable"
          />
        </div>
      ) : result.items.length === 0 ? (
        <div className="mt-7">
          <EmptyState
            description="Search again or check back after ECK publishes articles."
            href="/insights"
            linkLabel="Reset search"
            title="No published articles yet"
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {result.items.map((article) => (
            <ContentCard
              description={article.excerpt}
              href={`/insights/${article.slug}`}
              image={article.featuredImage}
              key={article.id}
              linkLabel="Read article"
              meta={[
                article.category,
                article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : null,
                article.id.startsWith("sample-") ? "Sample" : null,
              ].filter(Boolean).join(" · ")}
              title={article.title}
            />
          ))}
        </div>
      )}

      {!unavailable && (
        <ContentPagination page={result.page} pages={result.pages} pathname="/insights" query={query} />
      )}
    </>
  );
}
