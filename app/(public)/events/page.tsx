import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Events and Activities" };

export default function EventsPage() {
  const activities = [
    { slug: "community-conversations", title: "Community conversations", image: "/images/community-dialogue.jpg", alt: "People in conversation in a shared workspace", description: "An illustrative format for a possible community discussion. No event has been announced." },
    { slug: "business-gatherings", title: "Business gatherings", image: "/images/karachi-business.jpg", alt: "Modern business buildings in a city", description: "An illustrative format for future planning. Dates, locations and availability are not confirmed." },
  ];

  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Events & activities · illustrative</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-brand-purple sm:text-6xl">A window into what brings people together.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-brand-ink/70">The examples below show how activity information may be presented. They are not announcements, and no dates or registration details have been confirmed.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {activities.map((activity) => (
            <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" key={activity.slug}>
              <div className="relative aspect-[16/9]"><Image alt={activity.alt} className="object-cover" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" src={activity.image} /></div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">Illustrative format · not scheduled</p>
                <h2 className="mt-3 text-xl font-semibold text-brand-purple">{activity.title}</h2>
                <p className="mt-3 text-sm leading-6 text-brand-ink/70">{activity.description}</p>
                <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/events/${activity.slug}`}>View activity format <span aria-hidden="true" className="ml-2">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
