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
  title: "About ECK",
  description: "Learn what is currently known about Economic Club Karachi and what remains for the organization to confirm.",
  path: "/about",
});

type Purpose = {
  title: string;
  text: string;
  border: string;
};

type Concept = {
  title: string;
  text: string;
  image: string;
};

type Milestone = {
  number: string;
  title: string;
  text: string;
};

const purposes: Purpose[] = [
  {
    title: "Mission",
    text: "A draft prompt: how might ECK describe the welfare work it exists to do, and the people or communities it intends to serve?",
    border: "border-brand-purple/15",
  },
  {
    title: "Vision",
    text: "A draft prompt: what long-term change does ECK hope to contribute to in Karachi, and how will it define meaningful progress?",
    border: "border-brand-teal",
  },
];

const coreValues = ["Listening", "Transparency", "Respect", "Shared responsibility"];

const concepts: Concept[] = [
  {
    title: "Economic learning",
    text: "An illustrative concept for accessible conversations about everyday economic topics.",
    image: "/images/ideas-workspace.jpg",
  },
  {
    title: "Community dialogue",
    text: "A sample format for listening to different perspectives on local priorities.",
    image: "/images/community-dialogue.jpg",
  },
  {
    title: "Shared knowledge",
    text: "A possible way to bring practical experience and research into one discussion.",
    image: "/images/conversation.jpg",
  },
];

const milestones: Milestone[] = [
  { number: "01", title: "Organization profile", text: "Confirm the story and purpose ECK wants to share." },
  { number: "02", title: "Activities", text: "Add dates and details only when the organization verifies them." },
  { number: "03", title: "Community impact", text: "Share outcomes when supporting information is available." },
];

const faqs = [
  { question: "What is Economic Club Karachi?", answer: "ECK's public profile describes it as a growing welfare organization in Karachi. Further organizational details are awaiting confirmation." },
  { question: "What initiatives does ECK run?", answer: "Current initiatives have not been verified for this website. Please contact ECK for up-to-date information." },
];

function ConceptCard({ concept }: { concept: Concept }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image alt="" className="object-cover" fill sizes="(max-width: 768px) 100vw, 33vw" src={concept.image} />
      </div>
      <div className="p-6">
        <Eyebrow>Illustrative concept</Eyebrow>
        <h3 className="font-display mt-3 text-xl leading-snug text-brand-purple">{concept.title}</h3>
        <p className="mt-3 text-sm leading-6 text-brand-ink/70">{concept.text}</p>
      </div>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "About ECK" }]}
        description="A clear introduction to what is known today, with the organization's deeper story still being confirmed."
        eyebrow="About ECK"
        title="A growing welfare organization in Karachi."
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div
            className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20"
            data-reveal
          >
            <SectionHeading
              description="Economic Club Karachi&apos;s public profile describes it as a growing welfare organization. Its organizational history, leadership, communities served, and current programmes have not yet been independently confirmed for this website."
              eyebrow="Organization overview"
              size="md"
              title="An introduction grounded in what ECK has shared."
            />
            <aside className="border-l-2 border-brand-teal pl-6">
              <Eyebrow>Editorial status</Eyebrow>
              <p className="mt-3 text-base leading-7 text-brand-ink/70">
                The mission, vision, and values below are proposed prompts for ECK review, not approved organizational
                statements.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow>Purpose · proposed for review</Eyebrow>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {purposes.map((purpose) => (
                <article className={`border-t-2 pt-6 ${purpose.border}`} key={purpose.title}>
                  <h2 className="font-display text-3xl leading-[1.1] text-brand-purple">{purpose.title}</h2>
                  <p className="mt-4 text-base leading-7 text-brand-ink/70">{purpose.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow>Core values · discussion prompts</Eyebrow>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coreValues.map((value) => (
                <Card className="p-6" key={value}>
                  <h2 className="font-display text-lg leading-snug text-brand-purple">{value}</h2>
                  <p className="mt-2 text-sm leading-6 text-brand-ink/65">
                    A suggested value for client discussion, not a verified ECK commitment.
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div
            className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16"
            data-reveal
          >
            <SectionHeading
              eyebrow="Business & community orientation"
              size="md"
              title="Different perspectives belong in the same conversation."
            />
            <p className="text-base leading-7 text-brand-ink/70">
              ECK&apos;s public identity includes the words “Economic Club,” while its public profile describes a welfare
              organization. How these aspects relate should be explained by ECK itself; this site does not infer a
              business model or a confirmed service offering.
            </p>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              description="We will publish activity descriptions only after ECK confirms their purpose, status, and participation details."
              eyebrow="Initiatives & activities"
              size="md"
              title="ECK&apos;s current work is being confirmed."
            />
            <div className="mt-6">
              <SampleContentNotice />
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {concepts.map((concept) => (
                <ConceptCard concept={concept} key={concept.title} />
              ))}
            </div>
            <Link className="editorial-link mt-6 inline-flex text-sm font-bold text-brand-purple" href="/contact#inquiry">
              Ask ECK about current initiatives <span aria-hidden="true" className="ml-2">↗</span>
            </Link>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div
            className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:items-center md:gap-16"
            data-reveal
          >
            <SectionHeading eyebrow="Milestones" size="md" title="A timeline needs verified dates." />
            <div>
              <SampleContentNotice />
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {milestones.map((milestone) => (
                  <article className="border-t-2 border-brand-purple/15 bg-brand-paper p-5" key={milestone.number}>
                    <span className="font-display text-2xl text-brand-teal">{milestone.number}</span>
                    <h3 className="font-display mt-2 text-base text-brand-purple">{milestone.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-brand-ink/70">{milestone.text}</p>
                  </article>
                ))}
              </div>
            </div>
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
              <Eyebrow tone="dark">Continue the conversation</Eyebrow>
              <h2 className="font-display mt-3 text-3xl leading-[1.1] sm:text-4xl">Ask ECK about its current work.</h2>
            </div>
            <ButtonLink href="/contact#inquiry" variant="primary">
              Contact ECK
            </ButtonLink>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
