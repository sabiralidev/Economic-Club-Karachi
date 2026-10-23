import Image from "next/image";
import { notFound } from "next/navigation";
import { insightDrafts } from "@/lib/content/insights";

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const draft = insightDrafts.find((article) => article.slug === slug);
  if (!draft) notFound();

  return (
    <article className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Proposed article · for ECK review</p>
        <h1 className="font-display text-4xl leading-tight text-brand-purple sm:text-6xl">{draft.title}</h1>
        <p className="mt-5 text-lg leading-8 text-brand-ink/70">{draft.summary}</p>
        <div className="relative mt-9 aspect-[16/8] overflow-hidden rounded-sm">
          <Image alt={draft.imageAlt} className="object-cover" fill loading="lazy" sizes="(max-width: 900px) 100vw, 850px" src={draft.image} />
        </div>
        <div className="mt-9 space-y-5 text-base leading-8 text-brand-ink/75">
          {draft.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </article>
  );
}
