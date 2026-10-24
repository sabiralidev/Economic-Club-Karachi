import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InquiryForm } from "@/components/home/inquiry-form";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
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
      <section className="bg-brand-purple py-10 text-white sm:py-14"><div className="mx-auto max-w-content px-5 sm:px-8"><Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.title }]} /><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">{service.category}</p><h1 className="font-display mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">{service.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{service.summary}</p></div></section>
      <article className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <div>{service.image && <div className="relative mb-8 aspect-[16/9] overflow-hidden"><Image alt={service.title} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 60vw" src={service.image} unoptimized={service.image.startsWith("https://")} /></div>}<div className="whitespace-pre-line text-base leading-8 text-brand-ink/75">{service.description}</div></div>
        <aside className="h-fit border border-brand-purple/10 bg-white p-6 sm:p-8"><h2 className="font-display text-2xl text-brand-purple">Ask about this service</h2><p className="mt-3 text-sm leading-6 text-brand-ink/65">Availability and any terms should be confirmed directly with ECK.</p><div className="mt-6"><InquiryForm defaultPurpose="services" defaultMessage={`I would like to enquire about ${service.title}.`} /></div></aside>
      </div></article>
      <div className="mx-auto max-w-content px-5 py-8 sm:px-8"><Link className="text-sm font-bold text-brand-purple underline" href="/services">← Back to services</Link></div>
    </>
  );
}
