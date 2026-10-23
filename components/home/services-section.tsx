import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

const themes = [
  {
    number: "01",
    title: "Ideas & dialogue",
    description: "A possible space for thoughtful exchange on issues shaping business and community life.",
    slug: "ideas-and-dialogue",
  },
  {
    number: "02",
    title: "Community initiatives",
    description: "A possible focus on community-minded work, to be defined with ECK and its stakeholders.",
    slug: "community-initiatives",
  },
  {
    number: "03",
    title: "Professional connection",
    description: "An opportunity to explore how people and organizations might connect through ECK.",
    slug: "professional-connection",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between" data-reveal>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Possible areas of work</p>
              <h2 className="font-display max-w-2xl text-4xl leading-tight text-brand-purple sm:text-5xl">A starting point for what ECK may explore.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-brand-ink/65">These are working themes for discussion, not confirmed services or current programmes.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {themes.map((theme) => (
              <article className="home-card flex min-h-[290px] flex-col border-t-2 border-brand-purple/15 bg-brand-paper p-6 sm:p-8" data-reveal key={theme.number}>
                <span className="font-display text-3xl text-brand-teal">{theme.number}</span>
                <h3 className="mt-9 text-xl font-semibold text-brand-purple">{theme.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-brand-ink/70">{theme.description}</p>
                <Link className="editorial-link mt-6 w-fit text-sm font-semibold text-brand-purple underline" href={`/services/${theme.slug}`}>
                  Explore this proposed theme <span aria-hidden="true" className="ml-1">↗</span>
                </Link>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}