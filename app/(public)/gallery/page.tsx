import Link from "next/link";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { PageHero } from "@/components/public/page-hero";
import { galleryItems } from "@/lib/content/gallery";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery",
  description: "Browse approved Economic Club Karachi event and community photography.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments from ECK, when approved." description="A home for verified event and community photography. Stock editorial imagery elsewhere on this site is not shown as ECK activity." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><GalleryBrowser items={galleryItems} /></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Share an approved image</p><h2 className="font-display mt-3 text-3xl text-brand-purple">Have a story or photo for ECK?</h2><p className="mt-3 max-w-xl text-sm leading-6 text-brand-ink/65">Contact ECK first; the site does not accept image uploads. Please ensure participants have agreed before any image is shared.</p></div><Link className="inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white" href="/contact?topic=general#inquiry">Contact ECK</Link></div></section>
    </>
  );
}
