import Link from "next/link";
import { InquiryForm } from "@/components/home/inquiry-form";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PageHero } from "@/components/public/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo";
import { getPublicSiteSettings } from "@/lib/content/database";

export const metadata = pageMetadata({
  title: "Contact ECK",
  description: "Send an enquiry to Economic Club Karachi about its current work or a possible collaboration.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

const topics = ["general", "membership", "partnership", "services"] as const;

const topicLinks = [
  { value: "general", label: "General" },
  { value: "membership", label: "Membership" },
  { value: "partnership", label: "Partnership" },
  { value: "services", label: "Service idea" },
] as const;

const faqs = [
  {
    question: "Is my enquiry sent directly to a staff member?",
    answer: "The form stores submissions in the configured website database for ECK review. No named recipient has been confirmed.",
  },
  {
    question: "Can I contact ECK through social media?",
    answer: "No official social profiles have been verified for publication here.",
  },
  {
    question: "What if the form reports an error?",
    answer: "The enquiry was not confirmed as received. Please try again later; no alternative verified contact detail is currently available.",
  },
];

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { topic } = await searchParams;
  const defaultPurpose = topics.find((value) => value === topic) ?? "general";
  let settings = null;
  let settingsUnavailable = false;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    settingsUnavailable = true;
  }

  const hasContactDetails = Boolean(
    settings?.contact?.email || settings?.contact?.phone || settings?.contact?.address,
  );

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Contact ECK" }]}
        description="Use the enquiry form to ask about ECK, its current work, or a possible conversation."
        eyebrow="Contact Economic Club Karachi"
        title="Start with a question."
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div
            className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
            data-reveal
          >
            <div>
              <SectionHeading eyebrow="Contact information" size="md" title="Reach out online." />
              <div className="mt-4 space-y-2 text-base leading-7 text-brand-ink/70">
                {settings?.contact?.email && (
                  <p>
                    Email:{" "}
                    <a className="editorial-link text-brand-purple" href={`mailto:${settings.contact.email}`}>
                      {settings.contact.email}
                    </a>
                  </p>
                )}
                {settings?.contact?.phone && (
                  <p>
                    Phone:{" "}
                    <a className="editorial-link text-brand-purple" href={`tel:${settings.contact.phone}`}>
                      {settings.contact.phone}
                    </a>
                  </p>
                )}
                {settings?.contact?.address && <p>Address: {settings.contact.address}</p>}
                {!hasContactDetails && (
                  <p>
                    {settingsUnavailable
                      ? "Official contact details could not be loaded. You can still send an enquiry using the form."
                      : "An official email address, telephone number, and office address have not been supplied. This form is the available contact route on this website."}
                  </p>
                )}
              </div>
            </div>
            <aside className="border-l-2 border-brand-teal pl-6">
              <p className="text-sm leading-6 text-brand-ink/70">
                The website can confirm that a form submission has been received. It cannot promise when ECK will
                respond.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <Eyebrow>Choose an enquiry category</Eyebrow>
            <div className="mt-5 flex flex-wrap gap-3">
              {topicLinks.map((item) => (
                <Link
                  className="inline-flex min-h-10 items-center rounded-sm border border-brand-purple/15 px-4 py-2 text-sm font-semibold text-brand-purple transition-colors duration-200 ease-out-soft hover:border-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-teal-deep"
                  href={`/contact?topic=${item.value}#inquiry`}
                  key={item.value}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-paper py-14 sm:py-20" id="contact-form">
          <div
            className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
            data-reveal
          >
            <div>
              <SectionHeading
                eyebrow="Business & partnership"
                size="md"
                title="Tell us what you would like to explore."
              />
              <p className="mt-4 text-sm leading-6 text-brand-ink/65">
                Submitting an enquiry does not imply that a service or partnership is available or agreed.
              </p>
            </div>
            <InquiryForm defaultPurpose={defaultPurpose} />
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-content px-5 sm:px-8" data-reveal>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
