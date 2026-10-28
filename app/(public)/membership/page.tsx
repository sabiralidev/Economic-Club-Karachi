import { InquiryForm } from "@/components/home/inquiry-form";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { SampleContentNotice } from "@/components/public/sample-content-notice";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { sampleMemberships } from "@/lib/content/sample-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Membership",
  description: "Express interest in Economic Club Karachi and ask about current participation options.",
  path: "/membership",
});

type Interest = {
  title: string;
  text: string;
};

type Membership = (typeof sampleMemberships)[number];

const interests: Interest[] = [
  { title: "Learn about ECK", text: "Ask about the organization and its current work." },
  { title: "Explore participation", text: "Ask whether there are current ways to get involved." },
  { title: "Discuss partnership", text: "Share an idea for ECK to review." },
];

const nextSteps = [
  "Share your interest and question.",
  "ECK reviews the enquiry.",
  "The organization can provide current details if available.",
];

const faqs = [
  {
    question: "Is this a membership application?",
    answer: "No. It is an expression of interest. ECK has not provided an approved application process.",
  },
  {
    question: "Are there membership tiers or benefits?",
    answer: "No tiers, eligibility rules, benefits, or fees have been verified for this website.",
  },
  {
    question: "When will ECK respond?",
    answer: "Response time has not been confirmed. The form shows whether your enquiry was received by the website.",
  },
];

function MembershipCard({ membership }: { membership: Membership }) {
  const price = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: membership.price.currency,
    maximumFractionDigits: 0,
  }).format(membership.price.amount);

  return (
    <Card className="flex flex-col p-6">
      <Eyebrow>{membership.category}</Eyebrow>
      <h3 className="font-display mt-3 text-xl leading-snug text-brand-purple">{membership.name}</h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-brand-ink/70">{membership.description}</p>
      <p className="mt-5 font-display text-2xl text-brand-purple">
        {price}
        <span className="ml-1 font-sans text-xs font-medium text-brand-ink/60">/ {membership.price.period}</span>
      </p>
      <p className="mt-1 text-xs text-brand-ink/55">Illustrative amount; not an approved fee.</p>
      <ul className="mt-5 space-y-2 border-t border-brand-purple/10 pt-4">
        {membership.features.map((feature) => (
          <li className="text-sm leading-6 text-brand-ink/70" key={feature}>
            <span aria-hidden="true" className="mr-2 text-brand-teal-deep">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function MembershipPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Membership" }]}
        description="Share what you would like to learn about ECK. No membership tier, eligibility rule, or benefit has been confirmed."
        eyebrow="Membership & participation"
        title="Begin with an expression of interest."
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 md:grid-cols-2 md:gap-16" data-reveal>
            <SectionHeading eyebrow="Introduction" size="md" title="A first step, not an application decision." />
            <p className="text-base leading-7 text-brand-ink/70">
              This form lets you express interest and ask for current information. It does not create membership or
              guarantee acceptance, benefits, or a follow-up timeline.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow>Ways to express interest · for discussion</Eyebrow>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {interests.map((item) => (
                <article className="border-t-2 border-brand-purple/15 bg-brand-paper p-6" key={item.title}>
                  <h2 className="font-display text-lg leading-snug text-brand-purple">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-brand-ink/70">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              actions={<Badge square>Sample only</Badge>}
              eyebrow="Example membership options"
              size="md"
              title="Illustrative plans from the local data file."
            />
            <div className="mt-6">
              <SampleContentNotice />
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sampleMemberships.map((membership) => (
                <MembershipCard key={membership.slug} membership={membership} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <SectionHeading
              eyebrow="Eligibility & benefits"
              size="md"
              title="Confirm membership details with ECK."
            />
            <p className="mt-4 max-w-3xl text-sm leading-6 text-brand-ink/65">
              The sample options above do not establish ECK’s actual membership model. Eligibility, fees, benefits, and
              participation requirements need confirmation directly from the organization.
            </p>
          </div>
        </section>

        <section className="mesh-dark grain relative overflow-hidden py-14 text-white sm:py-20">
          <div className="relative mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow tone="dark">What happens next · proposed flow</Eyebrow>
            <ol className="mt-7 grid gap-6 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <li className="border-t border-white/20 pt-4" key={step}>
                  <span className="font-display text-2xl text-brand-teal">0{index + 1}</span>
                  <p className="mt-3 text-sm leading-6 text-white/80">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-white/55">
              This describes the enquiry flow only, not a formal application or guaranteed response time.
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
              <SectionHeading
                eyebrow="Expression of interest"
                size="md"
                title="Tell us what you would like to know."
              />
              <p className="mt-4 text-sm leading-6 text-brand-ink/65">
                Please avoid sharing sensitive personal or financial information.
              </p>
            </div>
            <InquiryForm application />
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
