import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { insightDrafts } from "@/lib/content/insights";
import { getServerEnvironment } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

type InsightPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: InsightPageProps) {
  const { slug } = await params;
  const draft = insightDrafts.find((article) => article.slug === slug);
  if (!draft) return { title: "Article not found" };
  const metadata = pageMetadata({ title: `${draft.title} · Draft`, description: draft.summary, path: `/insights/${draft.slug}`, type: "article" });
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: draft.image, alt: draft.imageAlt }] } };
}

export default async function InsightDetailPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const draft = insightDrafts.find((article) => article.slug === slug);
  if (!draft) notFound();
  const articleUrl = new URL(`/insights/${draft.slug}`, getServerEnvironment().NEXT_PUBLIC_SITE_URL).toString();
  const relatedArticles = insightDrafts.filter((article) => article.slug !== draft.slug).slice(0, 3);

  return (
    <>
      <header className="bg-brand-purple py-10 text-white sm:py-14"><div className="mx-auto max-w-3xl px-5 sm:px-8"><Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: draft.title }]} /><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">{draft.category} · proposed draft for review</p><h1 className="font-display mt-4 text-4xl leading-tight sm:text-6xl">{draft.title}</h1><p className="mt-5 text-lg leading-8 text-white/75">{draft.summary}</p><p className="mt-5 text-xs text-white/55">Author and publication date not supplied.</p></div></header>
      <article className="bg-brand-paper py-12 sm:py-16"><div className="mx-auto max-w-3xl px-5 sm:px-8"><div className="relative aspect-[16/8] overflow-hidden"><Image alt={draft.imageAlt} className="object-cover" fill loading="lazy" sizes="(max-width: 900px) 100vw, 850px" src={draft.image} /></div><div className="mt-9 space-y-6 text-base leading-8 text-brand-ink/75">{draft.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div aria-label="Share draft" className="mt-10 flex flex-wrap items-center gap-4 border-y border-brand-purple/10 py-5 text-sm" role="group"><span className="font-semibold text-brand-purple">Share</span><a className="underline underline-offset-4 hover:text-brand-purple" href={`mailto:?subject=${encodeURIComponent(draft.title)}&body=${encodeURIComponent(articleUrl)}`}>Email</a><a className="underline underline-offset-4 hover:text-brand-purple" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`} rel="noreferrer" target="_blank">LinkedIn</a></div></div></article>
      {relatedArticles.length > 0 && <section className="bg-white py-12 sm:py-16"><div className="mx-auto max-w-3xl px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Related drafts</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{relatedArticles.map((article) => <Link className="home-card border border-brand-purple/10 p-5" href={`/insights/${article.slug}`} key={article.slug}><span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0e716b]">{article.category}</span><span className="mt-2 block font-semibold text-brand-purple">{article.title}</span></Link>)}</div></div></section>}
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8"><Link className="editorial-link text-sm font-bold text-brand-purple underline" href="/insights">← Back to insights</Link></div>
    </>
  );
}
