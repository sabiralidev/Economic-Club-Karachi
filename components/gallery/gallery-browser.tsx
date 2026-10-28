"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import type { GalleryContent } from "@/lib/content/database";

type GalleryBrowserProps = { items: GalleryContent[]; unavailable?: boolean };

const dialogButton =
  "inline-flex min-h-11 items-center justify-center rounded-sm border border-white/25 px-4 text-sm font-semibold text-white transition duration-200 ease-out-soft hover:border-white hover:bg-white hover:text-brand-purple disabled:pointer-events-none disabled:opacity-40";

export function GalleryBrowser({ items, unavailable = false }: GalleryBrowserProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const images = items.flatMap((item) =>
    item.images.map((image, imageIndex) => ({
      ...image,
      key: `${item.id}-${imageIndex}`,
      title: item.title,
      slug: item.slug,
      category: item.category,
      description: item.description,
    })),
  );
  const activeImage = activeIndex === null ? undefined : images[activeIndex];
  const hasSample = items.some((item) => item.id.startsWith("sample-"));

  function move(direction: -1 | 1) {
    if (images.length > 1 && activeIndex !== null) {
      setActiveIndex((activeIndex + direction + images.length) % images.length);
    }
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      {hasSample && (
        <div className="mt-7">
          <SampleContentNotice />
        </div>
      )}

      {unavailable ? (
        <div className="mt-7">
          <EmptyState
            description="We could not load approved gallery items. Please try again shortly."
            title="Gallery is temporarily unavailable"
          />
        </div>
      ) : images.length === 0 ? (
        <div className="mt-7">
          <EmptyState
            description="This gallery will show event and community images after ECK supplies and approves them."
            href="/contact?topic=general#inquiry"
            linkLabel="Ask about contributing photos"
            title="No approved ECK photos yet"
          />
        </div>
      ) : (
        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li className="group overflow-hidden border border-brand-purple/10 bg-white" key={image.key}>
              <figure className="m-0">
                <button
                  aria-label={`Open image: ${image.alt}`}
                  className="relative block aspect-square w-full overflow-hidden bg-brand-purple/5"
                  onClick={() => {
                    setActiveIndex(index);
                    dialogRef.current?.showModal();
                  }}
                  type="button"
                >
                  <Image
                    alt={image.alt}
                    className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    src={image.src}
                    unoptimized={image.src.startsWith("https://")}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-purple/90 to-transparent p-3 pt-8 text-left text-xs font-semibold text-white">
                    {image.caption || "Open image"}
                  </span>
                </button>
                <figcaption className="p-3">
                  <Link className="link-underline text-sm font-semibold text-brand-purple" href={`/gallery/${image.slug}`}>
                    {image.title}
                  </Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}

      <dialog
        aria-label="Gallery image viewer"
        className="m-auto w-[min(94vw,64rem)] max-w-none border-0 bg-brand-purple p-0 text-white backdrop:bg-brand-purple/85"
        onClose={() => setActiveIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        ref={dialogRef}
      >
        {activeImage && (
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-5">
              <div>
                <h2 className="font-display text-lg">{activeImage.title}</h2>
                {activeImage.caption && <p className="mt-1 text-sm text-white/70">{activeImage.caption}</p>}
              </div>
              <button aria-label="Close image viewer" className={dialogButton} onClick={close} type="button">
                Close
              </button>
            </div>
            <div className="relative aspect-[16/10] bg-black/20">
              <Image
                alt={activeImage.alt}
                className="object-contain"
                fill
                sizes="94vw"
                src={activeImage.src}
                unoptimized={activeImage.src.startsWith("https://")}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button className={dialogButton} disabled={images.length < 2} onClick={() => move(-1)} type="button">
                <span aria-hidden="true" className="mr-1">←</span> Previous image
              </button>
              <span className="text-xs uppercase tracking-[0.16em] text-white/55">
                {activeIndex === null ? 0 : activeIndex + 1} / {images.length}
              </span>
              <button className={dialogButton} disabled={images.length < 2} onClick={() => move(1)} type="button">
                Next image <span aria-hidden="true" className="ml-1">→</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
