import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
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

  const shareLinks = [
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(articleUrl)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}` },
  ];

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Insights", href: "/insights" }, { label: article.title }]}
        container="max-w-3xl py-14 sm:py-20"
        description={article.excerpt}
        eyebrow={`${article.category}${article.id.startsWith("sample-") ? " · Sample article" : ""}`}
        notice={article.id.startsWith("sample-") ? <SampleContentNotice /> : undefined}
        title={article.title}
      />

      <article className="bg-brand-paper py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {article.publishedAt && (
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-ink/50">
              Published {new Date(article.publishedAt).toLocaleDateString()}
            </p>
          )}

          {article.featuredImage && (
            <div className="relative aspect-[16/8] overflow-hidden border border-brand-purple/10 bg-white">
              <Image
                alt={article.title}
                className="object-cover"
                fill
                sizes="(max-width: 900px) 100vw, 850px"
                src={article.featuredImage}
                unoptimized={article.featuredImage.startsWith("https://")}
              />
            </div>
          )}

          <div className="mt-9 whitespace-pre-line text-base leading-8 text-brand-ink/75">{article.body}</div>

          {article.tags.length > 0 && (
            <ul aria-label="Article tags" className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li className="rounded-sm border border-brand-purple/15 px-3 py-1 text-xs text-brand-ink/70" key={tag}>{tag}</li>
              ))}
            </ul>
          )}

          <div aria-label="Share article" className="mt-10 flex flex-wrap items-center gap-5 border-y border-brand-purple/10 py-5 text-sm" role="group">
            <span className="eyebrow">Share</span>
            {shareLinks.map((link) => (
              <a
                className="link-underline font-semibold text-brand-purple"
                href={link.href}
                key={link.label}
                {...(link.href.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <p className="eyebrow">Related articles</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((item) => (
                <Card className="p-5" interactive key={item.id}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-teal-deep">{item.category}</p>
                  <Link className="link-underline mt-2 block font-display text-lg leading-snug text-brand-purple" href={`/insights/${item.slug}`}>
                    {item.title}
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <Link className="link-underline text-sm font-bold text-brand-purple" href="/insights">
          <span aria-hidden="true" className="mr-1">←</span> Back to insights
        </Link>
      </div>
    </>
  );
}
