import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { PageHero } from "@/components/public/page-hero";
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
    <>
      <PageHero
        breadcrumbs={[{ label: "Gallery", href: "/gallery" }, { label: item.title }]}
        description={item.description || "Approved ECK photography."}
        eyebrow={`${item.category}${item.id.startsWith("sample-") ? " · Sample" : ""}`}
        notice={item.id.startsWith("sample-") ? <SampleContentNotice /> : undefined}
        title={item.title}
      />

      <section className="bg-brand-paper py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <ul className="grid gap-5 sm:grid-cols-2">
            {item.images.map((image, index) => (
              <li key={`${image.src}-${index}`}>
                <figure className="m-0 border border-brand-purple/10 bg-white">
                  <div className="relative aspect-[16/9] overflow-hidden bg-brand-purple/5">
                    <Image
                      alt={image.alt}
                      className="object-contain"
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      src={image.src}
                      unoptimized={image.src.startsWith("https://")}
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="border-t border-brand-purple/10 p-4 text-sm leading-6 text-brand-ink/70">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-brand-purple/10 pt-6">
            <Link className="link-underline text-sm font-bold text-brand-purple" href="/gallery">
              <span aria-hidden="true" className="mr-1">←</span> Back to gallery
            </Link>
            <Link className="link-underline text-sm font-bold text-brand-purple" href="/contact?topic=general#inquiry">
              Ask about this image <span aria-hidden="true" className="ml-1">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
