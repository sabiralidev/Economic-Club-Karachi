import type { BreadcrumbItem } from "@/components/public/breadcrumbs";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { HeroEntrance } from "@/components/home/hero-entrance";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs?: BreadcrumbItem[];
};

export function PageHero({ eyebrow, title, description, breadcrumbs = [] }: PageHeroProps) {
  return (
    <section className="bg-brand-purple text-white">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <HeroEntrance>
          {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-teal" data-hero-item>{eyebrow}</p>
          <h1 className="font-display max-w-4xl text-4xl leading-tight sm:text-6xl" data-hero-item>{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8" data-hero-item>{description}</p>
        </HeroEntrance>
      </div>
    </section>
  );
}