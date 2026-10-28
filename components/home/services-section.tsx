import Link from "next/link";
import { EmptyState } from "@/components/public/empty-state";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ServiceSummary } from "@/lib/content/database";

export function ServicesSection({ services, unavailable = false }: { services: ServiceSummary[]; unavailable?: boolean }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <ScrollReveal>
          <SectionHeading
            actions={
              <Link className="link-underline text-sm font-bold text-brand-purple" href="/services">
                All services <span aria-hidden="true">↗</span>
              </Link>
            }
            className="[&>div:last-child]:pb-1"
            description="Published programmes and areas of work. Availability is confirmed directly with ECK."
            eyebrow="Services"
            title="Published work and services."
          />
          {services.some((service) => service.id.startsWith("sample-")) && (
            <div className="mt-8" data-reveal>
              <SampleContentNotice />
            </div>
          )}
          {unavailable ? (
            <div className="mt-10">
              <EmptyState
                description="We could not load published services. Please try again shortly."
                title="Services are temporarily unavailable"
              />
            </div>
          ) : services.length ? (
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {services.map((service) => (
                <article
                  className="home-card group flex min-h-[260px] flex-col rounded-sm border border-brand-purple/10 border-t-2 border-t-brand-purple/20 bg-brand-paper p-7 sm:p-8"
                  data-reveal
                  key={service.id}
                >
                  <span className="eyebrow">
                    {service.category}
                    {service.id.startsWith("sample-") ? " · Sample" : ""}
                  </span>
                  <h3 className="mt-5 font-display text-2xl leading-snug text-brand-purple">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-brand-ink/70">{service.summary}</p>
                  <Link
                    className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-purple underline decoration-brand-teal decoration-2 underline-offset-4"
                    href={`/services/${service.slug}`}
                  >
                    Service details
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                description="Published services will appear here when they are available."
                title="No services published yet"
              />
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
