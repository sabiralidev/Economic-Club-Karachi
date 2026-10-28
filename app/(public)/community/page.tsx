import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Community and Initiatives",
  description: "Learn what is confirmed about ECK's community work and ask about current participation.",
  path: "/community",
});

type Principle = {
  title: string;
  text: string;
};

type Concept = {
  title: string;
  text: string;
  image: string;
};

const principles: Principle[] = [
  { title: "Listen first", text: "A proposed principle: understand needs and context before suggesting action." },
  { title: "Work with consent", text: "A proposed principle: make participation voluntary and expectations clear." },
  { title: "Share responsibly", text: "A proposed principle: publish stories or images only with appropriate permission." },
];

const categories = ["Community wellbeing", "Learning and exchange", "Local participation"];

const concepts: Concept[] = [
  {
    title: "Community listening",
    text: "A sample gathering to hear which local questions matter most to participants.",
    image: "/images/community-dialogue.jpg",
  },
  {
    title: "Learning together",
    text: "An illustrative workshop concept for making economic topics accessible to a broad audience.",
    image: "/images/ideas-workspace.jpg",
  },
  {
    title: "Shared perspectives",
    text: "A possible conversation format for connecting people with different experiences.",
    image: "/images/conversation.jpg",
  },
];

const participationSteps = [
  "Share a question or idea.",
  "Ask ECK about any current opportunities.",
  "Confirm expectations before participating.",
];

const faqs = [
  {
    question: "How can I participate?",
    answer: "No current participation process has been confirmed. Contact ECK to ask about available opportunities.",
  },
  {
    question: "Can I suggest an initiative?",
    answer: "You can submit an idea for ECK's consideration. This does not imply a commitment to run it.",
  },
];

function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image alt="" className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw" src={concept.image} />
      </div>
      <div className="p-6">
        <Eyebrow>Example concept</Eyebrow>
        <h3 className="font-display mt-3 text-xl leading-snug text-brand-purple">{concept.title}</h3>
        <p className="mt-3 text-sm leading-6 text-brand-ink/70">{concept.text}</p>
      </div>
    </Card>
  );
}

export default function CommunityPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Community & initiatives" }]}
        description="ECK describes itself as a growing welfare organization. Its current initiatives and participation opportunities are awaiting confirmation."
        eyebrow="Community & initiatives"
        title="Community work starts by listening."
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16" data-reveal>
            <SectionHeading eyebrow="Community introduction" size="md" title="Local context matters." />
            <p className="text-base leading-7 text-brand-ink/70">
              ECK&apos;s public profile describes it as a growing welfare organization. The organization has not supplied
              verified descriptions of its communities, initiative areas, or current projects for publication here.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow>Purpose & values · for discussion</Eyebrow>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {principles.map((item) => (
                <article className="border-t-2 border-brand-teal bg-brand-paper p-6" key={item.title}>
                  <h2 className="font-display text-lg leading-snug text-brand-purple">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-brand-ink/70">{item.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs text-brand-ink/55">These are editorial prompts, not adopted ECK policies.</p>
          </div>
        </section>

        <section className="mesh-dark grain relative overflow-hidden py-14 text-white sm:py-20">
          <div className="relative mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow tone="dark">Potential initiative categories · proposed</Eyebrow>
            <h2 className="font-display mt-4 max-w-3xl text-3xl leading-[1.1] sm:text-4xl">
              The work should be described by the people doing it.
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {categories.map((category) => (
                <p className="border-t border-white/25 pt-4 text-base font-semibold text-white/85" key={category}>
                  {category}
                </p>
              ))}
            </div>
            <p className="mt-5 text-sm text-white/60">
              Category labels are placeholders for ECK review, not verified active initiatives.
            </p>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              description="These sample concepts are not claims about current or completed ECK projects."
              eyebrow="Illustrative initiative concepts"
              size="md"
              title="Examples of stories ECK could share."
            />
            <div className="mt-6">
              <SampleContentNotice />
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {concepts.map((concept) => (
                <ConceptCard concept={concept} key={concept.title} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div
            className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-16"
            data-reveal
          >
            <div>
              <SectionHeading
                eyebrow="Participation"
                size="md"
                title="Ask before making a commitment."
              />
              <p className="mt-4 text-sm leading-6 text-brand-ink/65">
                Volunteer roles, eligibility, schedules, and safeguarding requirements have not been supplied.
              </p>
              <Link
                className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple"
                href="/contact?topic=general#inquiry"
              >
                Ask about participation <span aria-hidden="true" className="ml-2">↗</span>
              </Link>
            </div>
            <aside className="border-l-2 border-brand-teal bg-brand-paper p-6 sm:p-8">
              <Eyebrow>Sample participation steps</Eyebrow>
              <ol className="mt-5 space-y-5">
                {participationSteps.map((step, index) => (
                  <li className="flex gap-4" key={step}>
                    <span className="font-display text-xl text-brand-purple">0{index + 1}</span>
                    <p className="text-sm leading-6 text-brand-ink/70">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-xs text-brand-ink/55">
                An illustrative guide only; it is not an official volunteer process.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <section className="mesh-dark grain relative overflow-hidden py-16 text-white sm:py-20">
          <div
            className="relative mx-auto flex max-w-content flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between"
            data-reveal
          >
            <div>
              <Eyebrow tone="dark">Contact ECK</Eyebrow>
              <h2 className="font-display mt-3 text-3xl leading-[1.1] sm:text-4xl">Share a question or idea.</h2>
            </div>
            <ButtonLink href="/contact?topic=general#inquiry" variant="primary">
              Get in touch
            </ButtonLink>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
