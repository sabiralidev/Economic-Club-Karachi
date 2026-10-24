import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/home/inquiry-form";
import { ContentPagination } from "@/components/public/content-pagination";
import { EmptyState } from "@/components/public/empty-state";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
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
      <PageHero eyebrow="Services" title="Explore ECK’s published services." description="Services shown here have been published by Economic Club Karachi. Enquire directly to confirm current availability." />
      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <form action="/services" className="mb-8 flex flex-wrap gap-3 border-b border-brand-purple/10 pb-6">
            <label className="sr-only" htmlFor="service-search">Search services</label>
            <input className="min-h-11 min-w-64 flex-1 border border-brand-purple/20 bg-white px-4 text-sm" defaultValue={query.q} id="service-search" maxLength={100} name="q" placeholder="Search services" type="search" />
            <label className="sr-only" htmlFor="service-category">Category</label>
            <input className="min-h-11 border border-brand-purple/20 bg-white px-4 text-sm" defaultValue={query.category} id="service-category" maxLength={80} name="category" placeholder="Category" />
            <button className="min-h-11 rounded-sm bg-brand-purple px-5 text-sm font-semibold text-white" type="submit">Search</button>
          </form>
          {hasSampleContent && <div className="mb-7"><SampleContentNotice /></div>}
          {unavailable ? <EmptyState title="Services are temporarily unavailable" description="We could not load published service information. Please try again shortly." />
            : result.items.length === 0 ? <EmptyState title="No published services yet" description="Published services will appear here once ECK adds them." />
              : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {result.items.map((service) => (
                  <article className="home-card flex flex-col overflow-hidden border border-brand-purple/10 bg-white" key={service.id}>
                    {service.image && <div className="relative aspect-[16/9]"><Image alt={service.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw" src={service.image} unoptimized={service.image.startsWith("https://")} /></div>}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">{service.category}{service.id.startsWith("sample-") ? " · Sample" : ""}</p>
                      <h2 className="mt-3 text-xl font-semibold text-brand-purple">{service.title}</h2>
                      <p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/70">{service.summary}</p>
                      <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/services/${service.slug}`}>Service details <span aria-hidden="true" className="ml-2">↗</span></Link>
                    </div>
                  </article>
                ))}
              </div>}
          {!unavailable && <ContentPagination pathname="/services" page={result.page} pages={result.pages} query={query} />}
        </div>
      </section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Have a question?</p><h2 className="font-display mt-4 text-3xl text-brand-purple sm:text-4xl">Ask about current availability.</h2></div><InquiryForm defaultPurpose="services" /></div></section>
    </>
  );
}
