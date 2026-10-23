import Image from "next/image";
import Link from "next/link";
import { HeroEntrance } from "@/components/home/hero-entrance";

export function HeroSection() {
  return (
    <section className="bg-brand-purple text-white">
      <div className="mx-auto grid max-w-content gap-0 px-5 sm:px-8 lg:min-h-[620px] lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <HeroEntrance>
          <div className="flex h-full flex-col justify-center py-16 sm:py-20 lg:py-24 lg:pr-12">
            <p data-hero-item className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-teal">
              <span className="h-px w-8 bg-brand-teal" />
              Economic Club Karachi
            </p>
            <h1 data-hero-item className="font-display max-w-2xl text-[2.8rem] leading-[1.08] sm:text-6xl lg:text-[4.25rem]">
              Progress begins when people come together.
            </h1>
            <p data-hero-item className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              ECK is a growing welfare organization in Karachi. Learn about its work, share an idea, or start a conversation about getting involved.
            </p>
            <div data-hero-item className="mt-9 flex flex-wrap items-center gap-5">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-teal px-6 py-3 text-sm font-bold text-brand-purple transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" href="/contact#inquiry">
                Start a conversation
              </Link>
              <Link className="editorial-link text-sm font-semibold text-white underline" href="/about">
                Get to know ECK
              </Link>
            </div>
            <p data-hero-item className="mt-9 text-xs text-white/50">A first introduction. More about the organization is being confirmed.</p>
          </div>
        </HeroEntrance>
        <div className="hero-image-frame relative -mx-5 min-h-[340px] overflow-hidden sm:-mx-8 lg:mx-0 lg:min-h-0">
          <Image
            alt="A group sharing ideas around a table"
            className="hero-image object-cover object-center"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            src="/images/conversation.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/60 via-transparent to-brand-purple/5 lg:bg-gradient-to-r lg:from-brand-purple/20 lg:via-transparent lg:to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-sm border border-white/25 bg-brand-purple/80 px-4 py-3 text-xs text-white backdrop-blur-sm sm:bottom-8 sm:left-8">
            <span className="h-2 w-2 rounded-full bg-brand-teal" />
            Conversation begins here
          </div>
        </div>
      </div>
    </section>
  );
}