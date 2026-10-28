import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { ButtonLink } from "@/components/ui/button";
import { ContentPagination } from "@/components/public/content-pagination";
import { Field, Input } from "@/components/ui/field";
import { FilterBar } from "@/components/public/filter-bar";
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
      <PageHero
        description="A home for verified event and community photography. Stock editorial imagery elsewhere on this site is not shown as ECK activity."
        eyebrow="Gallery"
        title="Moments from ECK, when approved."
      />

      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <FilterBar
            action="/gallery"
            layout="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr]"
            submitLabel="Filter"
          >
            <Field id="gallery-search" label="Search gallery">
              <Input
                defaultValue={query.q}
                id="gallery-search"
                maxLength={100}
                name="q"
                placeholder="Search galleries"
                type="search"
              />
            </Field>
            <Field id="gallery-category" label="Category">
              <Input
                defaultValue={query.category}
                id="gallery-category"
                maxLength={80}
                name="category"
                placeholder="Any category"
              />
            </Field>
          </FilterBar>

          <GalleryBrowser items={result.items} unavailable={unavailable} />

          {!unavailable && (
            <ContentPagination page={result.page} pages={result.pages} pathname="/gallery" query={query} />
          )}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Share an approved image</p>
            <h2 className="font-display mt-3 text-3xl leading-[1.1] text-brand-purple sm:text-4xl">
              Have a story or photo for ECK?
            </h2>
            <p className="lead mt-3 max-w-xl">
              Contact ECK first; the site does not accept image uploads. Please ensure participants have agreed before any image is shared.
            </p>
          </div>
          <ButtonLink className="w-fit shrink-0" href="/contact?topic=general#inquiry" variant="dark">
            Contact ECK
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
