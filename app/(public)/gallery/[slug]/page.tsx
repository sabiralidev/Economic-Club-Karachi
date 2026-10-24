import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { galleryItems } from "@/lib/content/gallery";
import { pageMetadata } from "@/lib/seo";

type GalleryDetailProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: GalleryDetailProps) {
  const { slug } = await params;
  const item = galleryItems.find((galleryItem) => galleryItem.slug === slug);
  return item ? { ...pageMetadata({ title: item.title, description: item.caption ?? `Approved ECK gallery image: ${item.title}.`, path: `/gallery/${item.slug}` }), openGraph: { ...pageMetadata({ title: item.title, description: item.caption ?? `Approved ECK gallery image: ${item.title}.`, path: `/gallery/${item.slug}` }).openGraph, images: [{ url: item.src, alt: item.alt }] } } : { title: "Gallery item not found" };
}

export default async function GalleryDetailPage({ params }: GalleryDetailProps) {
  const { slug } = await params;
  const item = galleryItems.find((galleryItem) => galleryItem.slug === slug);
  if (!item) notFound();

  return (
    <article className="bg-brand-paper py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Breadcrumbs items={[{ label: "Gallery", href: "/gallery" }, { label: item.title }]} />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">{item.category}</p>
        <h1 className="font-display mt-3 text-4xl text-brand-purple sm:text-5xl">{item.title}</h1>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden bg-brand-purple/5"><Image alt={item.alt} className="object-contain" fill sizes="(max-width: 1100px) 100vw, 1000px" src={item.src} /></div>
        {item.caption && <p className="mt-4 text-sm leading-6 text-brand-ink/70">{item.caption}</p>}
        <div className="mt-8 flex flex-wrap justify-between gap-4"><Link className="editorial-link text-sm font-bold text-brand-purple underline" href="/gallery">← Back to gallery</Link><Link className="editorial-link text-sm font-bold text-brand-purple underline" href="/contact?topic=general#inquiry">Ask about this image <span aria-hidden="true" className="ml-1">↗</span></Link></div>
      </div>
    </article>
  );
}
