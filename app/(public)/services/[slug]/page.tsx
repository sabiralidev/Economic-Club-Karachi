import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/home/inquiry-form";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { proposedServices } from "@/lib/content/services";
import { pageMetadata } from "@/lib/seo";

type ServicePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = proposedServices.find((item) => item.slug === slug);
  return service ? pageMetadata({ title: `${service.title} · Proposed`, description: service.overview, path: `/services/${service.slug}` }) : { title: "Service concept not found" };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = proposedServices.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <section className="bg-brand-purple py-10 text-white sm:py-14"><div className="mx-auto max-w-content px-5 sm:px-8"><Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.title }]} /><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">{service.category} · proposed concept</p><h1 className="font-display mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">{service.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{service.overview}</p></div></section>
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Overview</p><h2 className="font-display mt-4 text-3xl text-brand-purple">A possible outcome</h2><p className="mt-4 text-base leading-7 text-brand-ink/70">{service.outcome}</p></div><div className="border-l-2 border-brand-teal pl-6"><p className="text-sm leading-6 text-brand-ink/65">This is a proposed service concept for ECK review. It is not a confirmed service, programme, or guarantee of availability.</p></div></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Objectives</p><ul className="mt-5 space-y-3">{service.objectives.map((objective) => <li className="flex gap-3 text-sm leading-6 text-brand-ink/70" key={objective}><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />{objective}</li>)}</ul></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Potential audience</p><ul className="mt-5 space-y-3">{service.audience.map((audience) => <li className="flex gap-3 text-sm leading-6 text-brand-ink/70" key={audience}><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow" />{audience}</li>)}</ul></div></div></section>
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Potential deliverables · subject to agreement</p><div className="mt-6 grid gap-4 md:grid-cols-3">{service.potentialDeliverables.map((deliverable, index) => <article className="border-t-2 border-brand-purple/15 bg-white p-6" key={deliverable}><span className="font-display text-2xl text-brand-teal">0{index + 1}</span><p className="mt-4 text-sm font-semibold leading-6 text-brand-purple">{deliverable}</p></article>)}</div></div></section>
      <section className="bg-brand-purple py-14 text-white sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">Possible process</p><ol className="mt-7 grid gap-6 md:grid-cols-3">{service.process.map((step, index) => <li className="border-t border-white/20 pt-4" key={step}><span className="font-display text-2xl text-brand-teal">0{index + 1}</span><p className="mt-3 text-sm leading-6 text-white/80">{step}</p></li>)}</ol></div></section>
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-18"><FaqAccordion items={service.faqs} /></div>
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Enquire about this concept</p><h2 className="font-display mt-4 text-3xl text-brand-purple">Share your question with ECK.</h2></div><InquiryForm defaultPurpose="services" defaultMessage={`I am interested in discussing the proposed ${service.title} concept.`} /></div></section>
      <div className="mx-auto max-w-content px-5 py-8 sm:px-8"><Link className="editorial-link text-sm font-bold text-brand-purple underline" href="/services">← Back to services</Link></div>
    </>
  );
}
