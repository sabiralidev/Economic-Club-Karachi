import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ArticleSummary } from "@/lib/content/database";

export function InsightsSection({ articles, unavailable = false }: { articles: ArticleSummary[]; unavailable?: boolean }) {
  const hasSample = articles.some((article) => article.id.startsWith("sample-"));

  return (
    <section className="bg-brand-paper-dark py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading
          actions={
            <Link className="link-underline text-sm font-bold text-brand-purple" href="/insights">
              Browse all articles
              <span aria-hidden="true" className="ml-1">↗</span>
            </Link>
          }
          className="[&>div:last-child]:pb-1"
          eyebrow="Insights & updates"
          title="Thoughtful perspectives from ECK."
        />

        {hasSample && (
          <div className="mt-8">
            <SampleContentNotice />
          </div>
        )}

        {unavailable ? (
          <div className="mt-8">
            <EmptyState
              description="We could not load published articles. Please try again shortly."
              title="Insights are temporarily unavailable"
            />
          </div>
        ) : articles.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {articles.map((article) => (
              <Card className="p-6 sm:p-8" interactive key={article.id}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-teal-deep">
                  {article.category}
                  {article.id.startsWith("sample-") ? " · Sample" : ""}
                </p>
                <h3 className="font-display mt-4 text-xl leading-snug text-brand-purple sm:text-2xl">{article.title}</h3>
                <p className="mt-3 text-sm leading-6 text-brand-ink/70">{article.excerpt}</p>
                <Link
                  className="link-underline mt-5 inline-flex text-sm font-bold text-brand-purple"
                  href={`/insights/${article.slug}`}
                >
                  Read article
                  <span aria-hidden="true" className="ml-2">↗</span>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState
              description="Published news and insights will appear here when available."
              href="/insights"
              linkLabel="Visit insights"
              title="No articles published yet"
            />
          </div>
        )}
      </div>
    </section>
  );
}
