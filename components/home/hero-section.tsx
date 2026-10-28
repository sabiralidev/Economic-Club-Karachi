import Image from "next/image";
import Link from "next/link";
import { HeroEntrance } from "@/components/home/hero-entrance";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";

export function HeroSection() {
  return (
    <section className="mesh-dark grain relative overflow-hidden text-white">
      <div className="relative mx-auto grid max-w-content gap-0 px-5 sm:px-8 lg:min-h-[640px] lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <HeroEntrance>
          <div className="flex h-full flex-col justify-center py-16 sm:py-20 lg:py-24 lg:pr-14">
            <Eyebrow className="flex items-center gap-3" data-hero-item tone="dark">
              <span aria-hidden="true" className="h-px w-8 bg-brand-teal" />
              Economic Club Karachi
            </Eyebrow>
            <h1
              className="font-display mt-7 max-w-2xl text-[2.9rem] leading-[1.05] sm:text-6xl lg:text-[4.4rem]"
              data-hero-item
            >
              Progress begins when people come together.
            </h1>
            <p
              className="mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg"
              data-hero-item
            >
              ECK is a growing welfare organization in Karachi. Learn about its work, share an idea, or
              start a conversation about getting involved.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5" data-hero-item>
              <ButtonLink href="/contact#inquiry" size="lg">
                Start a conversation
              </ButtonLink>
              <Link className="editorial-link text-sm font-semibold text-white underline" href="/about">
                Get to know ECK
              </Link>
            </div>
            <p className="mt-10 max-w-md text-xs leading-5 text-white/50" data-hero-item>
              A first introduction. More about the organization is being confirmed.
            </p>
          </div>
        </HeroEntrance>
        <div className="hero-image-frame relative -mx-5 min-h-[360px] overflow-hidden sm:-mx-8 lg:mx-0 lg:min-h-0">
          <Image
            alt="A group sharing ideas around a table"
            className="hero-image object-cover object-center"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            src="/images/conversation.jpg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/70 via-brand-purple/10 to-transparent lg:bg-gradient-to-r lg:from-brand-purple/25 lg:via-transparent lg:to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-sm border border-white/25 bg-brand-purple/80 px-4 py-3 text-xs text-white backdrop-blur-sm sm:bottom-8 sm:left-8">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-teal" />
            Conversation begins here
          </div>
        </div>
      </div>
    </section>
  );
}
