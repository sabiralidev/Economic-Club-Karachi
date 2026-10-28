import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Eyebrow } from "@/components/ui/eyebrow";

const highlights = [
  { value: "Karachi", label: "Based and locally minded" },
  { value: "Welfare", label: "Focus described in its public profile" },
  { value: "Open", label: "Conversations before commitments" },
];

export function IntroductionSection() {
  return (
    <section className="bg-brand-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-content items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-sm sm:min-h-[460px]"
          data-reveal
        >
          <Image
            alt="Contemporary business buildings viewed from below"
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 45vw"
            src="/images/karachi-business.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/50 to-transparent" />
          <span className="eyebrow eyebrow-on-dark absolute bottom-5 left-5">Editorial photography</span>
        </div>
        <ScrollReveal>
          <div data-reveal>
            <Eyebrow>An introduction</Eyebrow>
            <h2 className="font-display mt-4 max-w-xl text-4xl leading-[1.1] text-brand-purple sm:text-5xl">
              A community-minded perspective on a changing city.
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-base leading-8 text-brand-ink/75">
              <p>
                Economic Club Karachi describes itself as a growing welfare organization. Its public
                story and programme details are still being confirmed with the organization.
              </p>
              <p>
                This website is a starting point: a place to understand ECK, explore possible ways to
                connect, and ask the team directly about its current work.
              </p>
            </div>
            <dl className="mt-9 grid gap-5 border-t border-brand-purple/10 pt-7 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.value}>
                  <dt className="font-display text-2xl text-brand-purple">{item.value}</dt>
                  <dd className="mt-1 text-xs leading-5 text-brand-ink/60">{item.label}</dd>
                </div>
              ))}
            </dl>
            <Link
              className="editorial-link mt-8 inline-flex text-sm font-bold text-brand-purple underline"
              href="/about"
            >
              Read about ECK <span aria-hidden="true" className="ml-2">↗</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
