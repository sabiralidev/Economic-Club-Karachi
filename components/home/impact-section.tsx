import Image from "next/image";
import Link from "next/link";

const perspectives = [
  {
    label: "Business",
    title: "A place to exchange perspectives",
    text: "People and organizations can ask ECK about current opportunities for dialogue or collaboration. Specific offers should be confirmed directly.",
  },
  {
    label: "Community",
    title: "A welfare-minded point of view",
    text: "ECK describes itself as a growing welfare organization. Details about initiatives and participation are being gathered for review.",
  },
];

export function ImpactSection() {
  return (
    <section className="overflow-hidden bg-brand-purple py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-content gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-teal">Business & community</p>
          <h2 className="font-display max-w-lg text-4xl leading-tight sm:text-5xl">Different perspectives. Shared questions.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
            ECK&apos;s business-facing and community-facing work is being defined with the organization. These are conversation starters, not claims of proven outcomes.
          </p>
          <Link className="editorial-link mt-7 inline-flex text-sm font-bold text-white underline" href="/business">
            Explore the business perspective <span aria-hidden="true" className="ml-2">↗</span>
          </Link>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-sm sm:min-h-[440px]">
          <Image
            alt="A quiet modern workspace prepared for a conversation"
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 55vw"
            src="/images/ideas-workspace.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/90 via-brand-purple/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 grid gap-0 sm:grid-cols-2">
            {perspectives.map((item) => (
              <article className="border-t border-white/20 p-5 sm:p-6" key={item.label}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-teal">{item.label}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}