"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/public/empty-state";
import type { GalleryCategory, GalleryItem } from "@/lib/content/gallery";

type GalleryBrowserProps = {
  items: GalleryItem[];
};

const categories: { label: string; value: GalleryCategory | "all" }[] = [
  { label: "All images", value: "all" },
  { label: "Events", value: "events" },
  { label: "Community", value: "community" },
  { label: "People", value: "people" },
];

export function GalleryBrowser({ items }: GalleryBrowserProps) {
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const visibleItems = items.filter((item) => category === "all" || item.category === category);
  const activeItem = activeIndex === null ? undefined : visibleItems[activeIndex];

  function openLightbox(index: number) {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  }

  function moveLightbox(direction: -1 | 1) {
    if (visibleItems.length < 2 || activeIndex === null) return;
    setActiveIndex((activeIndex + direction + visibleItems.length) % visibleItems.length);
  }

  return (
    <>
      <div aria-label="Filter gallery by proposed category" className="flex flex-wrap gap-2" role="group">
        {categories.map((item) => (
          <button aria-pressed={category === item.value} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item.value ? "border-brand-purple bg-brand-purple text-white" : "border-brand-purple/15 text-brand-ink/70 hover:border-brand-purple"}`} key={item.value} onClick={() => { setCategory(item.value); setActiveIndex(null); }} type="button">{item.label}</button>
        ))}
      </div>
      <p className="mt-3 text-xs text-brand-ink/55">Gallery categories are a proposed structure and require ECK review.</p>
      {visibleItems.length === 0 ? (
        <div className="mt-7"><EmptyState title="No approved ECK photos yet" description="This gallery will show event and community images after ECK supplies and approves them. Editorial stock photos elsewhere on this site are not represented as ECK activities." href="/contact?topic=general#inquiry" linkLabel="Ask about contributing photos" /></div>
      ) : (
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((item, index) => (
            <button aria-label={`Open image: ${item.title}`} className="group relative aspect-square overflow-hidden bg-brand-purple/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e716b]" key={item.slug} onClick={() => openLightbox(index)} type="button">
              <Image alt={item.alt} className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" src={item.src} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-purple/90 to-transparent p-3 pt-8 text-left text-xs font-semibold text-white">{item.title}</span>
            </button>
          ))}
        </div>
      )}
      <dialog aria-label="Gallery image viewer" className="m-auto w-[min(94vw,64rem)] max-w-none border-0 bg-brand-purple p-0 text-white backdrop:bg-brand-purple/85" onClose={() => setActiveIndex(null)} onKeyDown={(event) => { if (event.key === "ArrowLeft") moveLightbox(-1); if (event.key === "ArrowRight") moveLightbox(1); }} ref={dialogRef}>
        {activeItem && <div className="p-4 sm:p-6"><div className="mb-4 flex items-center justify-between gap-5"><div><h2 className="font-semibold">{activeItem.title}</h2>{activeItem.caption && <p className="mt-1 text-sm text-white/70">{activeItem.caption}</p>}</div><button aria-label="Close image viewer" className="rounded-sm px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" onClick={() => dialogRef.current?.close()} type="button">Close</button></div><div className="relative aspect-[16/10] bg-black/20"><Image alt={activeItem.alt} className="object-contain" fill sizes="94vw" src={activeItem.src} /></div><div className="mt-4 flex justify-between"><button className="min-h-11 px-4 text-sm font-semibold text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" disabled={visibleItems.length < 2} onClick={() => moveLightbox(-1)} type="button">Previous image</button><button className="min-h-11 px-4 text-sm font-semibold text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]" disabled={visibleItems.length < 2} onClick={() => moveLightbox(1)} type="button">Next image</button></div></div>}
      </dialog>
    </>
  );
}