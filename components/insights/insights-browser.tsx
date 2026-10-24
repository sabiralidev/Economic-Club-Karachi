"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/public/empty-state";
import type { InsightDraft } from "@/lib/content/insights";

type InsightsBrowserProps = {
  articles: InsightDraft[];
};

const pageSize = 1;

export function InsightsBrowser({ articles }: InsightsBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const categories = ["All topics", ...Array.from(new Set(articles.map((article) => article.category)))];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = category === "All topics" || article.category === category;
    const searchableText = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
  const visibleArticles = filteredArticles.slice(0, visibleCount);

  function updateCategory(value: string) {
    setCategory(value);
    setVisibleCount(pageSize);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setVisibleCount(pageSize);
  }

  return (
    <>
      <div className="grid gap-5 border-b border-brand-purple/10 pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-semibold text-brand-purple" htmlFor="insights-search">Search drafts
          <input className="min-h-12 w-full border border-brand-purple/20 bg-white px-4 font-normal text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0e716b] md:max-w-md" id="insights-search" onChange={(event) => updateQuery(event.target.value)} placeholder="Search by title or topic" type="search" value={query} />
        </label>
        <div aria-label="Filter articles by category" className="flex flex-wrap gap-2" role="group">
          {categories.map((item) => <button aria-pressed={category === item} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? "border-brand-purple bg-brand-purple text-white" : "border-brand-purple/15 text-brand-ink/70 hover:border-brand-purple"}`} key={item} onClick={() => updateCategory(item)} type="button">{item}</button>)}
        </div>
      </div>
      <p className="mt-4 text-xs text-brand-ink/55">All items are proposed editorial drafts, not published ECK statements.</p>
      {visibleArticles.length === 0 ? (
        <div className="mt-7"><EmptyState title="No matching articles" description="Try a different search phrase or topic." /></div>
      ) : (
        <>
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {visibleArticles.map((article) => <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" key={article.slug}>
              <div className="relative aspect-[16/9]"><Image alt={article.imageAlt} className="object-cover" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" src={article.image} /></div>
              <div className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">{article.category} · draft for review</p><h2 className="mt-3 text-xl font-semibold text-brand-purple">{article.title}</h2><p className="mt-3 text-sm leading-6 text-brand-ink/70">{article.summary}</p><Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/insights/${article.slug}`}>Read proposed draft <span aria-hidden="true" className="ml-2">↗</span></Link></div>
            </article>)}
          </div>
          {visibleCount < filteredArticles.length && <div className="mt-8 text-center"><button className="min-h-12 rounded-md border border-brand-purple/20 px-6 py-3 text-sm font-semibold text-brand-purple hover:border-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e716b]" onClick={() => setVisibleCount((count) => count + pageSize)} type="button">Show more drafts</button></div>}
        </>
      )}
    </>
  );
}