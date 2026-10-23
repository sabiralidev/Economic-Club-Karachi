import Image from "next/image";
import Link from "next/link";
import { insightDrafts } from "@/lib/content/insights";

export function InsightsSection() {
  return (
    <section className="bg-[#eeece7] py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[380px]">
            <Image
              alt="A bright workspace ready for writing and ideas"
              className="object-cover"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/images/ideas-workspace.jpg"
            />
            <span className="absolute bottom-4 left-4 bg-brand-purple px-3 py-2 text-xs font-semibold text-white">Editorial photography</span>
          </div>
          <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Insights & updates</p>
          <h2 className="font-display max-w-xl text-4xl leading-tight text-brand-purple sm:text-5xl">The next chapter deserves a thoughtful voice.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-brand-ink/70">
            Proposed discussion drafts are available for ECK&apos;s editorial review. They are not published organizational statements.
          </p>
          <Link className="editorial-link mt-7 inline-flex text-sm font-bold text-brand-purple underline" href="/insights">
            Browse proposed drafts <span aria-hidden="true" className="ml-2">↗</span>
          </Link>
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {insightDrafts.map((draft) => (
            <article className="home-card border border-brand-purple/10 bg-white p-6 sm:p-8" key={draft.slug}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0e716b]">Proposed article · for review</p>
              <h3 className="mt-4 text-xl font-semibold text-brand-purple">{draft.title}</h3>
              <p className="mt-3 text-sm leading-6 text-brand-ink/70">{draft.summary}</p>
              <Link className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple underline" href={`/insights/${draft.slug}`}>
                Read draft <span aria-hidden="true" className="ml-2">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}