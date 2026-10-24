import { PageHero } from "@/components/public/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use · Draft",
  description: "Draft website terms for Economic Club Karachi, pending client and legal review.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal · draft for review" title="Website terms of use" description="Draft text for client and legal review. It does not establish legal guarantees or determine governing law." />
      <article className="mx-auto max-w-3xl space-y-8 px-5 py-14 text-base leading-7 text-brand-ink/75 sm:px-8 sm:py-20">
        <p className="border-l-2 border-brand-teal pl-5 text-sm">Draft terms. Confirm the operating entity, jurisdiction, governing law, dispute process, and any required notices with qualified counsel before publication.</p>
        <section><h2 className="text-xl font-semibold text-brand-purple">Website information</h2><p className="mt-3">Content on this website is provided for general information. Proposed themes, sample layouts, and editorial drafts are identified as such and should not be treated as confirmed ECK offers or announcements.</p></section>
        <section><h2 className="text-xl font-semibold text-brand-purple">Enquiries</h2><p className="mt-3">Submitting an enquiry expresses interest only. It does not create membership, a service agreement, a partnership, or a commitment by ECK to respond within a particular time.</p></section>
        <section><h2 className="text-xl font-semibold text-brand-purple">Content and external links</h2><p className="mt-3">The site owner should confirm rights and attribution for published materials and review any external links before launch. No endorsements are implied by an external link.</p></section>
        <section><h2 className="text-xl font-semibold text-brand-purple">Updates</h2><p className="mt-3">Terms, effective dates, and update procedures must be reviewed and approved before this draft is treated as operative.</p></section>
        <p className="text-xs text-brand-ink/55">Effective date: pending. Legal review required before launch.</p>
      </article>
    </>
  );
}
