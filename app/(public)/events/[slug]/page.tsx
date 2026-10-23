import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const activities: Record<string, { title: string; description: string; image: string; alt: string }> = {
  "community-conversations": {
    title: "Community conversations",
    description: "An illustrative activity format for a possible community discussion. No event has been announced or scheduled.",
    image: "/images/community-dialogue.jpg",
    alt: "People in conversation in a shared workspace",
  },
  "business-gatherings": {
    title: "Business gatherings",
    description: "An illustrative event format for future planning. Dates, locations and availability have not been confirmed.",
    image: "/images/karachi-business.jpg",
    alt: "Modern business buildings in a city",
  },
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = activities[slug];
  if (!activity) notFound();

  return (
    <article className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Illustrative activity format · not scheduled</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-brand-purple sm:text-6xl">{activity.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-ink/70">{activity.description}</p>
        <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-sm">
          <Image alt={activity.alt} className="object-cover" fill loading="lazy" sizes="(max-width: 900px) 100vw, 850px" src={activity.image} />
        </div>
        <p className="mt-8 max-w-2xl text-base leading-7 text-brand-ink/70">
          This page is a layout example, not an event announcement. Contact ECK for verified activities and current participation information.
        </p>
        <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e716b]" href="/contact?topic=general#inquiry">
          Ask about current activities
        </Link>
      </div>
    </article>
  );
}
