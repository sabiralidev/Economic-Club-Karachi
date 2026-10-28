import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/public/breadcrumbs";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { HeroEntrance } from "@/components/home/hero-entrance";
import { Eyebrow } from "@/components/ui/eyebrow";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Optional call-to-action row rendered under the description. */
  actions?: ReactNode;
  /** Optional notice rendered directly under the breadcrumbs (e.g. sample content). */
  notice?: ReactNode;
  /** Overrides the inner container classes, e.g. a narrower `max-w-3xl` measure. */
  container?: string;
};

export function PageHero({
  actions,
  breadcrumbs = [],
  container = "max-w-content py-16 sm:py-20 lg:py-24",
  description,
  eyebrow,
  notice,
  title,
}: PageHeroProps) {
  const narrow = container.includes("max-w-3xl");
  return (
    <section className="mesh-dark grain relative overflow-hidden text-white">
      <div className={`relative mx-auto px-5 sm:px-8 ${container}`}>
        <HeroEntrance>
          {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
          {notice && <div className="mb-6">{notice}</div>}
          <div className="mb-4" data-hero-item>
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          </div>
          <h1
            className={`font-display leading-[1.05] ${narrow ? "text-4xl sm:text-5xl" : "max-w-4xl text-4xl sm:text-5xl lg:text-6xl"}`}
            data-hero-item
          >
            {title}
          </h1>
          <p className={`mt-5 text-base leading-8 text-white/72 sm:text-lg ${narrow ? "" : "max-w-3xl"}`} data-hero-item>
            {description}
          </p>
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3" data-hero-item>{actions}</div>}
        </HeroEntrance>
      </div>
    </section>
  );
}
