import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  { title: "Connect", detail: "Build meaningful relationships across Karachi's business community.", color: "bg-brand-teal" },
  { title: "Learn", detail: "Exchange perspectives on the ideas shaping our shared economy.", color: "bg-brand-yellow" },
  { title: "Grow", detail: "Turn collaboration into opportunity for people and businesses.", color: "bg-brand-blue" },
];

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-brand-purple text-white">
        <div className="mx-auto grid max-w-content gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-teal">
              Ideas. Enterprise. Community.
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              A meeting place for Karachi&apos;s economic future.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">
              Economic Club Karachi brings people together to share knowledge, build
              relationships, and create opportunity.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/membership">
                Explore membership
              </ButtonLink>
              <Link
                className="rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
                href="/about"
              >
                Discover ECK
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
            <div className="absolute inset-8 rotate-45 rounded-[2rem] border border-brand-teal/60" />
            <div className="absolute inset-16 -rotate-12 rounded-full border border-brand-yellow/60" />
            <div className="grid h-36 w-36 rotate-45 place-items-center rounded-[2rem] bg-brand-teal shadow-[0_20px_80px_rgba(41,198,187,0.2)]">
              <div className="h-20 w-20 rounded-full bg-brand-yellow" />
            </div>
            <span className="absolute right-8 top-8 h-7 w-7 rounded-full bg-brand-blue" />
            <span className="absolute bottom-8 left-8 h-9 w-9 rounded-full bg-brand-green" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-content px-5 py-20 sm:px-8 sm:py-24">
        <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our purpose"
            title="A stronger economy starts with people working together."
          />
          <Link className="w-fit text-sm font-semibold text-brand-purple underline decoration-brand-teal decoration-2 underline-offset-4" href="/about">
            Learn about ECK
          </Link>
        </div>
        <ScrollReveal className="mt-12 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card data-reveal key={pillar.title}>
              <span aria-hidden="true" className={`mb-6 block h-2 w-12 rounded-full ${pillar.color}`} />
              <h3 className="text-xl font-semibold text-brand-purple">{pillar.title}</h3>
              <p className="mt-3 leading-7 text-brand-ink/70">{pillar.detail}</p>
            </Card>
          ))}
        </ScrollReveal>
      </section>
    </>
  );
}
