import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InquiryForm } from "@/components/home/inquiry-form";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { getServiceBySlug } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

type ServicePageProps = { params: Promise<{ slug: string }> };

const loadService = cache(async (slug: string) => getServiceBySlug(slug));

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await loadService(slug);
  return service
    ? pageMetadata({ title: service.seo?.title ?? service.title, description: service.seo?.description ?? service.summary, path: `/services/${service.slug}` })
    : { title: "Service not found" };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await loadService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
        description={service.summary}
        eyebrow={`${service.category}${service.id.startsWith("sample-") ? " · Sample" : ""}`}
        notice={service.id.startsWith("sample-") ? <SampleContentNotice /> : undefined}
        title={service.title}
      />

      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <article className="min-w-0">
            {service.image && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-brand-purple/10 bg-white">
                <Image
                  alt={service.title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  src={service.image}
                  unoptimized={service.image.startsWith("https://")}
                />
              </div>
            )}
            <div className="whitespace-pre-line text-base leading-8 text-brand-ink/75">{service.description}</div>
          </article>

          <aside className="h-fit border border-brand-purple/10 bg-white p-6 sm:p-8 lg:sticky lg:top-32">
            <p className="eyebrow">Enquire</p>
            <h2 className="font-display mt-3 text-2xl leading-snug text-brand-purple">Ask about this service</h2>
            <p className="mt-3 text-sm leading-6 text-brand-ink/65">
              Availability and any terms should be confirmed directly with ECK.
            </p>
            <div className="mt-6">
              <InquiryForm defaultMessage={`I would like to enquire about ${service.title}.`} defaultPurpose="services" />
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 pb-16 sm:px-8">
        <Link className="link-underline text-sm font-bold text-brand-purple" href="/services">
          <span aria-hidden="true" className="mr-1">←</span> Back to services
        </Link>
      </div>
    </>
  );
}
