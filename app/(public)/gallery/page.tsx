import Link from "next/link";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { ContentPagination } from "@/components/public/content-pagination";
import { PageHero } from "@/components/public/page-hero";
import { listGallery, type GalleryContent, type PageResult, type PublicPageQuery } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery",
  description: "Browse approved Economic Club Karachi event and community photography.",
  path: "/gallery",
});

type GalleryPageProps = { searchParams: Promise<PublicPageQuery> };

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const query = await searchParams;
  let result: PageResult<GalleryContent> = { items: [], page: 1, limit: 12, total: 0, pages: 0 };
  let unavailable = false;
  try {
    result = await listGallery(query);
  } catch {
    unavailable = true;
  }
  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments from ECK, when approved." description="A home for verified event and community photography. Stock editorial imagery elsewhere on this site is not shown as ECK activity." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8">
        <form action="/gallery" className="mb-7 flex flex-wrap gap-3 border-b border-brand-purple/10 pb-6">
          <label className="sr-only" htmlFor="gallery-search">Search gallery</label><input className="min-h-11 min-w-56 flex-1 border border-brand-purple/20 bg-white px-4 text-sm" defaultValue={query.q} id="gallery-search" maxLength={100} name="q" placeholder="Search galleries" type="search" />
          <label className="sr-only" htmlFor="gallery-category">Category</label><input className="min-h-11 border border-brand-purple/20 bg-white px-4 text-sm" defaultValue={query.category} id="gallery-category" maxLength={80} name="category" placeholder="Any category" />
          <button className="min-h-11 rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white" type="submit">Filter</button>
        </form>
        <GalleryBrowser items={result.items} unavailable={unavailable} />
        {!unavailable && <ContentPagination pathname="/gallery" page={result.page} pages={result.pages} query={query} />}
      </div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Share an approved image</p><h2 className="font-display mt-3 text-3xl text-brand-purple">Have a story or photo for ECK?</h2><p className="mt-3 max-w-xl text-sm leading-6 text-brand-ink/65">Contact ECK first; the site does not accept image uploads. Please ensure participants have agreed before any image is shared.</p></div><Link className="inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white" href="/contact?topic=general#inquiry">Contact ECK</Link></div></section>
    </>
  );
}
