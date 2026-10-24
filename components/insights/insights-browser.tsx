import Image from "next/image";
import Link from "next/link";
import { ContentPagination } from "@/components/public/content-pagination";
import { EmptyState } from "@/components/public/empty-state";
import type { ArticleSummary, PageResult, PublicPageQuery } from "@/lib/content/database";

type InsightsBrowserProps = {
  result: PageResult<ArticleSummary>;
  query: PublicPageQuery;
  unavailable?: boolean;
};

export function InsightsBrowser({ result, query, unavailable = false }: InsightsBrowserProps) {
  return (
    <>
      <form action="/insights" className="grid gap-4 border-b border-brand-purple/10 pb-6 md:grid-cols-[1fr_auto_auto] md:items-end">
        <label className="grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="insights-search">Search articles
          <input className="min-h-12 w-full border border-brand-purple/20 bg-white px-4 font-normal text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0e716b]" defaultValue={query.q} id="insights-search" maxLength={100} name="q" placeholder="Search by title or topic" type="search" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-brand-purple">Category
          <input className="min-h-12 border border-brand-purple/20 bg-white px-4 font-normal text-brand-ink" defaultValue={query.category} maxLength={80} name="category" placeholder="All categories" />
        </label>
        <button className="min-h-12 rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white" type="submit">Search</button>
      </form>
      {unavailable ? <div className="mt-7"><EmptyState title="Articles are temporarily unavailable" description="We could not load published articles. Please try again shortly." /></div>
        : result.items.length === 0 ? <div className="mt-7"><EmptyState title="No published articles yet" description="Search again or check back after ECK publishes articles." /></div>
          : <div className="mt-7 grid gap-6 md:grid-cols-2">
            {result.items.map((article) => <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" key={article.id}>
              {article.featuredImage && <div className="relative aspect-[16/9]"><Image alt={article.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" src={article.featuredImage} unoptimized={article.featuredImage.startsWith("https://")} /></div>}
              <div className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">{article.category}{article.publishedAt ? ` · ${new Date(article.publishedAt).toLocaleDateString()}` : ""}</p><h2 className="mt-3 text-xl font-semibold text-brand-purple">{article.title}</h2><p className="mt-3 text-sm leading-6 text-brand-ink/70">{article.excerpt}</p><Link className="mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/insights/${article.slug}`}>Read article <span aria-hidden="true" className="ml-2">↗</span></Link></div>
            </article>)}
          </div>}
      {!unavailable && <ContentPagination pathname="/insights" page={result.page} pages={result.pages} query={query} />}
    </>
  );
}
