import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

export function IntroductionSection() {
  return (
    <section className="bg-brand-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-content items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="relative min-h-[320px] overflow-hidden rounded-sm sm:min-h-[440px]" data-reveal>
          <Image
            alt="Contemporary business buildings viewed from below"
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 45vw"
            src="/images/karachi-business.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/40 to-transparent" />
          <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">Editorial photography</span>
        </div>
        <ScrollReveal>
          <div data-reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">An introduction</p>
            <h2 className="font-display max-w-xl text-4xl leading-tight text-brand-purple sm:text-5xl">
              A community-minded perspective on a changing city.
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-brand-ink/75">
              <p>
                Economic Club Karachi describes itself as a growing welfare organization. Its public story and programme details are still being confirmed with the organization.
              </p>
              <p>
                This website is a starting point: a place to understand ECK, explore possible ways to connect, and ask the team directly about its current work.
              </p>
            </div>
            <Link className="editorial-link mt-7 inline-flex text-sm font-bold text-brand-purple underline" href="/about">
              Read about ECK <span aria-hidden="true" className="ml-2">↗</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}