import Link from "next/link";
import { InquiryForm } from "@/components/home/inquiry-form";
import { ContentCard } from "@/components/public/content-card";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Business and Entrepreneurship",
  description: "Explore discussion prompts around business and entrepreneurship, and ask ECK about its current work.",
  path: "/business",
});

type FrameworkStep = {
  title: string;
  text: string;
};

type Collaboration = {
  title: string;
  text: string;
};

type SampleReading = {
  title: string;
  category: string;
  text: string;
  href: string;
};

const framework: FrameworkStep[] = [
  { title: "Questions", text: "What changes or constraints are people navigating?" },
  { title: "Perspectives", text: "Whose experience would make the conversation more complete?" },
  { title: "Possibilities", text: "What small next step could be explored, if participants agree?" },
];

const collaborations: Collaboration[] = [
  {
    title: "Shared learning",
    text: "Could a conversation help people compare experiences around a topic? This is an example question, not a scheduled event.",
  },
  {
    title: "Community perspective",
    text: "Could a local viewpoint inform how an issue is understood? Any involvement requires ECK and participant agreement.",
  },
];

const sampleReadings: SampleReading[] = [
  {
    title: "Export-led growth",
    category: "Economy",
    text: "A sample article topic on trade, productivity, and business competitiveness.",
    href: "/insights/future-export-led-growth-pakistan",
  },
  {
    title: "Financial technology",
    category: "Finance",
    text: "An illustrative reading topic about digital banking and financial services.",
    href: "/insights/digital-transformation-banking-sector",
  },
  {
    title: "Industry and development",
    category: "Development",
    text: "A sample topic for considering industrial cooperation and local enterprise.",
    href: "/insights/impact-cpec-phase-ii-industrialization",
  },
];

const formats: FrameworkStep[] = [
  {
    title: "Market questions",
    text: "A sample roundtable outline for comparing sector questions and identifying what information is missing.",
  },
  {
    title: "Founder perspectives",
    text: "An illustrative peer conversation about early-stage business challenges and lessons learned.",
  },
  {
    title: "Research to practice",
    text: "A possible format for discussing how published economic research relates to business decisions.",
  },
];

const faqs = [
  {
    question: "Does ECK offer business advice or funding?",
    answer: "No such service, funding offer, or policy has been verified. Please contact ECK for current information.",
  },
  {
    question: "Can I propose a business or entrepreneurship discussion?",
    answer: "Yes. You can send an idea for ECK to review; submission does not guarantee that an activity will be arranged.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Business & entrepreneurship" }]}
        description="A place to explore possible connections between business, entrepreneurship, and community life, without assuming a confirmed ECK programme."
        eyebrow="Business & entrepreneurship"
        title="Bring a question worth discussing."
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16" data-reveal>
            <SectionHeading eyebrow="Introduction" size="md" title="A local ecosystem has many voices." />
            <p className="text-base leading-7 text-brand-ink/70">
              ECK&apos;s confirmed business activities and entrepreneurship support have not been provided. This page
              presents questions people may bring to the organization, not a list of ECK offers.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              eyebrow="Business ecosystem · discussion framework"
              size="md"
              title="Start with what people need to understand."
            />
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {framework.map((step) => (
                <article className="border-t-2 border-brand-purple/15 bg-brand-paper p-6" key={step.title}>
                  <h3 className="font-display text-lg leading-snug text-brand-purple">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-brand-ink/70">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mesh-dark grain relative overflow-hidden py-14 text-white sm:py-20">
          <div className="relative mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16" data-reveal>
            <div>
              <Eyebrow tone="dark">Entrepreneurship</Eyebrow>
              <h2 className="font-display mt-4 text-3xl leading-[1.1] sm:text-4xl">
                Useful information before assumptions.
              </h2>
            </div>
            <p className="text-base leading-7 text-white/72">
              No business advice, funding, mentorship, accelerator, or entrepreneurship programme has been verified for
              ECK. Visitors can ask about current activities or suggest an educational topic for the organization to
              consider.
            </p>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow>Possible collaboration questions · illustrative</Eyebrow>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {collaborations.map((item) => (
                <Card className="p-6" key={item.title}>
                  <h2 className="font-display text-lg leading-snug text-brand-purple">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-brand-ink/70">{item.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-paper-dark py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              actions={<Badge square>Examples only</Badge>}
              eyebrow="Sample reading"
              size="md"
              title="Explore topics in the local data."
            />
            <div className="mt-6">
              <SampleContentNotice />
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {sampleReadings.map((item) => (
                <ContentCard
                  description={item.text}
                  headingLevel={3}
                  href={item.href}
                  key={item.title}
                  linkLabel="Read sample article"
                  meta={`${item.category} · Sample`}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              eyebrow="Illustrative discussion formats"
              size="md"
              title="Possible ways to exchange ideas."
            />
            <div className="mt-6">
              <SampleContentNotice />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {formats.map((item) => (
                <article className="border-t-2 border-brand-purple/15 bg-brand-paper p-6" key={item.title}>
                  <Eyebrow>Discussion concept</Eyebrow>
                  <h3 className="font-display mt-3 text-lg leading-snug text-brand-purple">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-brand-ink/70">{item.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs text-brand-ink/55">
              These are content examples, not confirmed ECK events, advice, funding, or services.
            </p>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <FaqAccordion items={faqs} />
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div
            className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
            data-reveal
          >
            <div>
              <SectionHeading eyebrow="Engage with ECK" size="md" title="Share a topic or question." />
              <Link
                className="editorial-link mt-5 inline-flex text-sm font-bold text-brand-purple"
                href="/contact?topic=partnership#inquiry"
              >
                Partnership enquiry <span aria-hidden="true" className="ml-2">↗</span>
              </Link>
            </div>
            <InquiryForm defaultPurpose="partnership" />
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
