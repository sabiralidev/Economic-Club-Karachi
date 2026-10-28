import { PageHero } from "@/components/public/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use · Draft",
  description: "Draft website terms for Economic Club Karachi, pending client and legal review.",
  path: "/terms",
});

type TermsSection = {
  title: string;
  body: string;
};

const termsSections: TermsSection[] = [
  {
    title: "Website information",
    body: "Content on this website is provided for general information. Proposed themes, sample layouts, and editorial drafts are identified as such and should not be treated as confirmed ECK offers or announcements.",
  },
  {
    title: "Enquiries",
    body: "Submitting an enquiry expresses interest only. It does not create membership, a service agreement, a partnership, or a commitment by ECK to respond within a particular time.",
  },
  {
    title: "Content and external links",
    body: "The site owner should confirm rights and attribution for published materials and review any external links before launch. No endorsements are implied by an external link.",
  },
  {
    title: "Updates",
    body: "Terms, effective dates, and update procedures must be reviewed and approved before this draft is treated as operative.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Website terms of use" }]}
        container="max-w-3xl py-16 sm:py-20"
        description="Draft text for client and legal review. It does not establish legal guarantees or determine governing law."
        eyebrow="Legal · draft for review"
        title="Website terms of use"
      />
      <ScrollReveal>
        <section className="bg-brand-paper py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <p className="border-l-2 border-brand-teal pl-5 text-sm leading-7 text-brand-ink/70" data-reveal>
              Draft terms. Confirm the operating entity, jurisdiction, governing law, dispute process, and any required
              notices with qualified counsel before publication.
            </p>
            <div className="mt-10 space-y-10">
              {termsSections.map((item) => (
                <section data-reveal key={item.title}>
                  <h2 className="font-display text-2xl leading-[1.1] text-brand-purple">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-brand-ink/70">{item.body}</p>
                </section>
              ))}
            </div>
            <p className="mt-10 text-xs text-brand-ink/55" data-reveal>
              Effective date: pending. Legal review required before launch.
            </p>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
