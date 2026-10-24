"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import type { GalleryContent } from "@/lib/content/database";

type GalleryBrowserProps = { items: GalleryContent[]; unavailable?: boolean };

export function GalleryBrowser({ items, unavailable = false }: GalleryBrowserProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visible = items;
  const images = visible.flatMap((item) => item.images.map((image, imageIndex) => ({
    ...image, key: `${item.id}-${imageIndex}`, title: item.title, slug: item.slug,
    category: item.category, description: item.description,
  })));
  const activeImage = activeIndex === null ? undefined : images[activeIndex];

  function move(direction: -1 | 1) {
    if (images.length > 1 && activeIndex !== null) setActiveIndex((activeIndex + direction + images.length) % images.length);
  }
  return (
    <>
      {items.some((item) => item.id.startsWith("sample-")) && <div className="mt-7"><SampleContentNotice /></div>}
      {unavailable ? <div className="mt-7"><EmptyState title="Gallery is temporarily unavailable" description="We could not load approved gallery items. Please try again shortly." /></div>
        : images.length === 0 ? <div className="mt-7"><EmptyState title="No approved ECK photos yet" description="This gallery will show event and community images after ECK supplies and approves them." href="/contact?topic=general#inquiry" linkLabel="Ask about contributing photos" /></div>
          : <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image, index) => <article className="group overflow-hidden border border-brand-purple/10 bg-white" key={image.key}>
              <button aria-label={`Open image: ${image.alt}`} className="relative block aspect-square w-full overflow-hidden bg-brand-purple/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e716b]" onClick={() => { setActiveIndex(index); dialogRef.current?.showModal(); }} type="button">
                <Image alt={image.alt} className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" src={image.src} unoptimized={image.src.startsWith("https://")} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-purple/90 to-transparent p-3 pt-8 text-left text-xs font-semibold text-white">Open image</span>
              </button>
              <Link className="block p-3 text-sm font-semibold text-brand-purple underline underline-offset-2" href={`/gallery/${image.slug}`}>{image.title}</Link>
            </article>)}
          </div>}
      <dialog aria-label="Gallery image viewer" className="m-auto w-[min(94vw,64rem)] max-w-none border-0 bg-brand-purple p-0 text-white backdrop:bg-brand-purple/85" onClose={() => setActiveIndex(null)} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }} ref={dialogRef}>
        {activeImage && <div className="p-4 sm:p-6"><div className="mb-4 flex items-center justify-between gap-5"><div><h2 className="font-semibold">{activeImage.title}</h2>{activeImage.caption && <p className="mt-1 text-sm text-white/70">{activeImage.caption}</p>}</div><button aria-label="Close image viewer" className="rounded-sm px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" onClick={() => dialogRef.current?.close()} type="button">Close</button></div><div className="relative aspect-[16/10] bg-black/20"><Image alt={activeImage.alt} className="object-contain" fill sizes="94vw" src={activeImage.src} unoptimized={activeImage.src.startsWith("https://")} /></div><div className="mt-4 flex justify-between"><button className="min-h-11 px-4 text-sm font-semibold text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" disabled={images.length < 2} onClick={() => move(-1)} type="button">Previous image</button><button className="min-h-11 px-4 text-sm font-semibold text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" disabled={images.length < 2} onClick={() => move(1)} type="button">Next image</button></div></div>}
      </dialog>
    </>
  );
}
