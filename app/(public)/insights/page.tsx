import Image from "next/image";
import Link from "next/link";
import { insightDrafts } from "@/lib/content/insights";

export const metadata = { title: "News and Insights" };

export default function InsightsPage() {
  return (
    <section className="bg-brand-paper py-16 sm:py-24">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Insights · proposed copy</p>
        <h1 className="font-display max-w-3xl text-4xl leading-tight text-brand-purple sm:text-6xl">Ideas for a considered conversation.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-brand-ink/70">These draft articles are presented for ECK editorial review only. They are not official organizational statements or published news.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {insightDrafts.map((draft) => (
            <article className="home-card overflow-hidden border border-brand-purple/10 bg-white" key={draft.slug}>
              <div className="relative aspect-[16/9]">
                <Image alt={draft.imageAlt} className="object-cover" fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" src={draft.image} />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">Proposed article · for review</p>
                <h2 className="mt-3 text-xl font-semibold text-brand-purple">{draft.title}</h2>
                <p className="mt-3 text-sm leading-6 text-brand-ink/70">{draft.summary}</p>
                <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/insights/${draft.slug}`}>Read draft <span aria-hidden="true" className="ml-2">↗</span></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
