import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

const activityCards = [
  {
    image: "/images/community-dialogue.jpg",
    alt: "People in conversation in a shared workspace",
    category: "Activity format · illustrative",
    title: "Community conversations",
    slug: "community-conversations",
    detail: "An example of the kind of activity information that may appear here. No event date has been announced.",
  },
  {
    image: "/images/karachi-business.jpg",
    alt: "Modern business buildings in a city",
    category: "Event format · illustrative",
    title: "Business gatherings",
    slug: "business-gatherings",
    detail: "A working example for this section only. Please contact ECK for confirmed plans and participation details.",
  },
];

export function EventsSection() {
  return (
    <section className="bg-brand-paper py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Events & activities</p>
              <h2 className="font-display max-w-2xl text-4xl leading-tight text-brand-purple sm:text-5xl">A window into what brings people together.</h2>
            </div>
            <Link className="editorial-link w-fit text-sm font-bold text-brand-purple underline" href="/events">All events & activities <span aria-hidden="true" className="ml-1">↗</span></Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {activityCards.map((card) => (
              <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" data-reveal key={card.title}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image alt={card.alt} className="object-cover transition-transform duration-500 hover:scale-[1.025]" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" src={card.image} />
                  <span className="absolute left-4 top-4 bg-white/95 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand-purple">{card.category}</span>
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-brand-purple">{card.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-brand-ink/70">{card.detail}</p>
                  <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/events/${card.slug}`}>View activity format <span aria-hidden="true" className="ml-1">↗</span></Link>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}