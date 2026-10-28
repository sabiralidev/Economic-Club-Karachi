import { PageHero } from "@/components/public/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Notice · Draft",
  description: "Draft privacy information for the Economic Club Karachi website, pending client and legal review.",
  path: "/privacy",
});

type NoticeSection = {
  title: string;
  body: string;
};

const privacySections: NoticeSection[] = [
  {
    title: "Information submitted",
    body: "The current enquiry form requests a name, email address, enquiry category, and message. Visitors should not include sensitive personal or financial information.",
  },
  {
    title: "How form submissions are handled",
    body: "When the database is configured, enquiries are stored by this website for review. The organization must confirm who can access submissions, how long they are kept, and how deletion or correction requests are handled.",
  },
  {
    title: "Cookies, analytics, and third parties",
    body: "The website owner should confirm whether analytics, cookies, embedded content, hosting services, or other third parties are used and update this draft accordingly.",
  },
  {
    title: "Questions or requests",
    body: "A verified privacy contact has not been provided. Add the appropriate contact route before treating this notice as final.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Privacy notice" }]}
        container="max-w-3xl py-16 sm:py-20"
        description="Draft text for client and legal review. This page is not a final privacy policy and does not claim regulatory compliance."
        eyebrow="Legal · draft for review"
        title="Privacy notice"
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <p className="border-l-2 border-brand-teal pl-5 text-sm leading-7 text-brand-ink/70" data-reveal>
              Draft notice. Confirm the responsible legal entity, applicable law, data retention, hosting providers,
              access controls, and contact process before publication.
            </p>
            <div className="mt-10 space-y-10">
              {privacySections.map((item) => (
                <section data-reveal key={item.title}>
                  <h2 className="font-display text-2xl leading-[1.1] text-brand-purple">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-brand-ink/70">{item.body}</p>
                </section>
              ))}
            </div>
            <p className="mt-10 text-xs text-brand-ink/55" data-reveal>
              Last reviewed: pending. Legal review required before launch.
            </p>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
