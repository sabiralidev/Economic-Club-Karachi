import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { ServiceSummary } from "@/lib/content/database";

export function ServicesSection({ services, unavailable = false }: { services: ServiceSummary[]; unavailable?: boolean }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8"><ScrollReveal>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between" data-reveal>
          <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Services</p><h2 className="font-display max-w-2xl text-4xl leading-tight text-brand-purple sm:text-5xl">Published work and services.</h2></div>
          <Link className="text-sm font-bold text-brand-purple underline" href="/services">All services <span aria-hidden="true" className="ml-1">↗</span></Link>
        </div>
        {services.some((service) => service.id.startsWith("sample-")) && <div className="mt-8" data-reveal><SampleContentNotice /></div>}
        {unavailable ? <div className="mt-8"><EmptyState title="Services are temporarily unavailable" description="We could not load published services. Please try again shortly." /></div> : services.length ? <div className="mt-12 grid gap-4 md:grid-cols-3">{services.map((service) => <article className="home-card flex min-h-[250px] flex-col border-t-2 border-brand-purple/15 bg-brand-paper p-6 sm:p-8" data-reveal key={service.id}>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-teal">{service.category}{service.id.startsWith("sample-") ? " · Sample" : ""}</span><h3 className="mt-5 text-xl font-semibold text-brand-purple">{service.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/70">{service.summary}</p><Link className="mt-6 w-fit text-sm font-semibold text-brand-purple underline" href={`/services/${service.slug}`}>Service details <span aria-hidden="true" className="ml-1">↗</span></Link>
        </article>)}</div> : <div className="mt-8"><EmptyState title="No services published yet" description="Published services will appear here when they are available." /></div>}
      </ScrollReveal></div>
    </section>
  );
}
