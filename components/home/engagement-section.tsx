import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";

const options = [
  { title: "Ask a question", description: "Reach out to understand ECK and its current areas of work.", href: "/contact?topic=general#inquiry" },
  { title: "Explore collaboration", description: "Share an idea for a possible community or business conversation.", href: "/contact?topic=partnership#inquiry" },
  { title: "Follow the updates", description: "Visit the insights page for approved news and perspectives as they become available.", href: "/insights" },
];

export function EngagementSection() {
  return (
    <section className="mesh-light bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow>Why engage with ECK</Eyebrow>
            <h2 className="font-display mt-4 max-w-lg text-4xl leading-[1.1] text-brand-purple sm:text-5xl">
              Start with a conversation, not a claim.
            </h2>
            <p className="lead mt-5 max-w-md">
              The most useful next step depends on what ECK is currently organizing. Tell the team what you are looking for and ask what is possible.
            </p>
          </div>
          <div className="divide-y divide-brand-purple/10 border-y border-brand-purple/10">
            {options.map((option, index) => (
              <Link
                className="group grid gap-3 py-6 transition-colors hover:bg-brand-paper/70 sm:grid-cols-[48px_1fr_auto] sm:items-center sm:gap-5"
                href={option.href}
                key={option.title}
              >
                <span className="font-display text-xl text-brand-teal-deep" aria-hidden="true">0{index + 1}</span>
                <span>
                  <span className="link-underline block text-lg font-semibold text-brand-purple">{option.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-brand-ink/65">{option.description}</span>
                </span>
                <span aria-hidden="true" className="text-lg text-brand-purple transition-transform duration-200 ease-out-soft group-hover:translate-x-1">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
