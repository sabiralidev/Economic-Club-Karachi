import { InquiryForm } from "@/components/home/inquiry-form";
import { ContentCard } from "@/components/public/content-card";
import { ContentPagination } from "@/components/public/content-pagination";
import { EmptyState } from "@/components/public/empty-state";
import { FilterBar } from "@/components/public/filter-bar";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { Field, Input } from "@/components/ui/field";
import { listServices, type PublicPageQuery } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services",
  description: "Explore published Economic Club Karachi services and enquire about current work.",
  path: "/services",
});

type ServicesPageProps = { searchParams: Promise<PublicPageQuery> };

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const query = await searchParams;
  let result;
  let unavailable = false;
  try {
    result = await listServices(query);
  } catch {
    unavailable = true;
    result = { items: [], page: 1, limit: 12, total: 0, pages: 0 };
  }
  const hasSampleContent = result.items.some((service) => service.id.startsWith("sample-"));

  return (
    <>
      <PageHero
        description="Services shown here have been published by Economic Club Karachi. Enquire directly to confirm current availability."
        eyebrow="Services"
        title="Explore ECK’s published services."
      />

      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <FilterBar
            action="/services"
            layout="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr]"
            submitLabel="Search"
          >
            <Field id="service-search" label="Search services">
              <Input
                defaultValue={query.q}
                id="service-search"
                maxLength={100}
                name="q"
                placeholder="Search services"
                type="search"
              />
            </Field>
            <Field id="service-category" label="Category">
              <Input
                defaultValue={query.category}
                id="service-category"
                maxLength={80}
                name="category"
                placeholder="Any category"
              />
            </Field>
          </FilterBar>

          {hasSampleContent && (
            <div className="mt-7">
              <SampleContentNotice />
            </div>
          )}

          {unavailable ? (
            <div className="mt-7">
              <EmptyState
                description="We could not load published service information. Please try again shortly."
                title="Services are temporarily unavailable"
              />
            </div>
          ) : result.items.length === 0 ? (
            <div className="mt-7">
              <EmptyState
                description="Published services will appear here once ECK adds them."
                href="/contact?topic=services#inquiry"
                linkLabel="Ask about services"
                title="No published services yet"
              />
            </div>
          ) : (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((service) => (
                <ContentCard
                  description={service.summary}
                  headingLevel={2}
                  href={`/services/${service.slug}`}
                  image={service.image}
                  imageSizes="(max-width: 768px) 100vw, 33vw"
                  key={service.id}
                  linkLabel="Service details"
                  meta={`${service.category}${service.id.startsWith("sample-") ? " · Sample" : ""}`}
                  title={service.title}
                />
              ))}
            </div>
          )}

          {!unavailable && (
            <ContentPagination page={result.page} pages={result.pages} pathname="/services" query={query} />
          )}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Have a question?</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.1] text-brand-purple sm:text-4xl">
              Ask about current availability.
            </h2>
            <p className="lead mt-5 max-w-md">
              Tell ECK what you need and the team will confirm what is possible today.
            </p>
          </div>
          <InquiryForm defaultPurpose="services" />
        </div>
      </section>
    </>
  );
}
