import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { getGalleryBySlug } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

type GalleryDetailProps = { params: Promise<{ slug: string }> };

const loadGallery = cache(async (slug: string) => getGalleryBySlug(slug));

export async function generateMetadata({ params }: GalleryDetailProps) {
  const { slug } = await params;
  const item = await loadGallery(slug);
  if (!item) return { title: "Gallery item not found" };
  const metadata = pageMetadata({ title: item.seo?.title ?? item.title, description: item.seo?.description ?? item.description, path: `/gallery/${item.slug}` });
  return { ...metadata, openGraph: { ...metadata.openGraph, images: item.images.map(({ src, alt }) => ({ url: src, alt })) } };
}

export default async function GalleryDetailPage({ params }: GalleryDetailProps) {
  const { slug } = await params;
  const item = await loadGallery(slug);
  if (!item) notFound();
  return (
    <article className="bg-brand-paper py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Breadcrumbs items={[{ label: "Gallery", href: "/gallery" }, { label: item.title }]} />
        {item.id.startsWith("sample-") && <div className="mt-6"><SampleContentNotice /></div>}
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">{item.category}</p>
        <h1 className="font-display mt-3 text-4xl text-brand-purple sm:text-5xl">{item.title}</h1>
        {item.description && <p className="mt-4 max-w-3xl text-base leading-7 text-brand-ink/70">{item.description}</p>}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {item.images.map((image, index) => <figure key={`${image.src}-${index}`}><div className="relative aspect-[16/9] overflow-hidden bg-brand-purple/5"><Image alt={image.alt} className="object-contain" fill sizes="(max-width: 700px) 100vw, 50vw" src={image.src} unoptimized={image.src.startsWith("https://")} /></div>{image.caption && <figcaption className="mt-2 text-sm leading-6 text-brand-ink/70">{image.caption}</figcaption>}</figure>)}
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-4"><Link className="text-sm font-bold text-brand-purple underline" href="/gallery">← Back to gallery</Link><Link className="text-sm font-bold text-brand-purple underline" href="/contact?topic=general#inquiry">Ask about this image <span aria-hidden="true" className="ml-1">↗</span></Link></div>
      </div>
    </article>
  );
}
