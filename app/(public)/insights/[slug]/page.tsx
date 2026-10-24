import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { getArticleBySlug, listArticles, type ArticleSummary } from "@/lib/content/database";
import { getServerEnvironment } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

type InsightPageProps = { params: Promise<{ slug: string }> };

const loadArticle = cache(async (slug: string) => getArticleBySlug(slug));

export async function generateMetadata({ params }: InsightPageProps) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "Article not found" };
  const metadata = pageMetadata({ title: article.seo?.title ?? article.title, description: article.seo?.description ?? article.excerpt, path: `/insights/${article.slug}`, type: "article" });
  return { ...metadata, openGraph: { ...metadata.openGraph, images: article.featuredImage ? [{ url: article.featuredImage, alt: article.title }] : [] } };
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();
  const articleUrl = new URL(`/insights/${article.slug}`, getServerEnvironment().NEXT_PUBLIC_SITE_URL).toString();
  let relatedArticles: ArticleSummary[] = [];
  try {
    const related = await listArticles({ category: article.category, limit: "4" });
    relatedArticles = related.items.filter((item) => item.slug !== article.slug).slice(0, 3);
  } catch {
    relatedArticles = [];
  }

  return (
    <>
      <header className="bg-brand-purple py-10 text-white sm:py-14"><div className="mx-auto max-w-3xl px-5 sm:px-8"><Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: article.title }]} /><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">{article.category}</p><h1 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">{article.title}</h1><p className="mt-5 text-lg leading-8 text-white/75">{article.excerpt}</p><p className="mt-5 text-xs text-white/55">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}</p></div></header>
      <article className="bg-brand-paper py-12 sm:py-16"><div className="mx-auto max-w-3xl px-5 sm:px-8">
        {article.featuredImage && <div className="relative aspect-[16/8] overflow-hidden"><Image alt={article.title} className="object-cover" fill sizes="(max-width: 900px) 100vw, 850px" src={article.featuredImage} unoptimized={article.featuredImage.startsWith("https://")} /></div>}
        <div className="mt-9 whitespace-pre-line text-base leading-8 text-brand-ink/75">{article.body}</div>
        {article.tags.length > 0 && <ul aria-label="Article tags" className="mt-8 flex flex-wrap gap-2">{article.tags.map((tag) => <li className="rounded-full border border-brand-purple/15 px-3 py-1 text-xs text-brand-ink/70" key={tag}>{tag}</li>)}</ul>}
        <div aria-label="Share article" className="mt-10 flex flex-wrap items-center gap-4 border-y border-brand-purple/10 py-5 text-sm" role="group"><span className="font-semibold text-brand-purple">Share</span><a className="underline underline-offset-4 hover:text-brand-purple" href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(articleUrl)}`}>Email</a><a className="underline underline-offset-4 hover:text-brand-purple" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`} rel="noreferrer" target="_blank">LinkedIn</a></div>
      </div></article>
      {relatedArticles.length > 0 && <section className="bg-white py-12 sm:py-16"><div className="mx-auto max-w-3xl px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Related articles</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{relatedArticles.map((item) => <Link className="home-card border border-brand-purple/10 p-5" href={`/insights/${item.slug}`} key={item.id}><span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0e716b]">{item.category}</span><span className="mt-2 block font-semibold text-brand-purple">{item.title}</span></Link>)}</div></div></section>}
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8"><Link className="text-sm font-bold text-brand-purple underline" href="/insights">← Back to insights</Link></div>
    </>
  );
}
