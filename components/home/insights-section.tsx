import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import type { ArticleSummary } from "@/lib/content/database";

export function InsightsSection({ articles, unavailable = false }: { articles: ArticleSummary[]; unavailable?: boolean }) {
  return (
    <section className="bg-[#eeece7] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Insights & updates</p><h2 className="font-display max-w-2xl text-4xl leading-tight text-brand-purple sm:text-5xl">Thoughtful perspectives from ECK.</h2></div>
          <Link className="text-sm font-bold text-brand-purple underline" href="/insights">Browse all articles <span aria-hidden="true" className="ml-1">↗</span></Link>
        </div>
        {articles.some((article) => article.id.startsWith("sample-")) && <div className="mt-8"><SampleContentNotice /></div>}
        {unavailable ? <div className="mt-8"><EmptyState title="Insights are temporarily unavailable" description="We could not load published articles. Please try again shortly." /></div> : articles.length ? <div className="mt-8 grid gap-4 md:grid-cols-2">{articles.map((article) => <article className="home-card border border-brand-purple/10 bg-white p-6 sm:p-8" key={article.id}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">{article.category}{article.id.startsWith("sample-") ? " · Sample" : ""}</p><h3 className="mt-4 text-xl font-semibold text-brand-purple">{article.title}</h3><p className="mt-3 text-sm leading-6 text-brand-ink/70">{article.excerpt}</p><Link className="mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/insights/${article.slug}`}>Read article <span aria-hidden="true" className="ml-2">↗</span></Link>
        </article>)}</div> : <div className="mt-8"><EmptyState title="No articles published yet" description="Published news and insights will appear here when available." href="/insights" linkLabel="Visit insights" /></div>}
      </div>
    </section>
  );
}
