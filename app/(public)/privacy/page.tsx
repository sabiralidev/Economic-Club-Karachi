import { PageHero } from "@/components/public/page-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Notice · Draft",
  description: "Draft privacy information for the Economic Club Karachi website, pending client and legal review.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal · draft for review" title="Privacy notice" description="Draft text for client and legal review. This page is not a final privacy policy and does not claim regulatory compliance." />
      <article className="mx-auto max-w-3xl space-y-8 px-5 py-14 text-base leading-7 text-brand-ink/75 sm:px-8 sm:py-20">
        <p className="border-l-2 border-brand-teal pl-5 text-sm">Draft notice. Confirm the responsible legal entity, applicable law, data retention, hosting providers, access controls, and contact process before publication.</p>
        <section><h2 className="text-xl font-semibold text-brand-purple">Information submitted</h2><p className="mt-3">The current enquiry form requests a name, email address, enquiry category, and message. Visitors should not include sensitive personal or financial information.</p></section>
        <section><h2 className="text-xl font-semibold text-brand-purple">How form submissions are handled</h2><p className="mt-3">When the database is configured, enquiries are stored by this website for review. The organization must confirm who can access submissions, how long they are kept, and how deletion or correction requests are handled.</p></section>
        <section><h2 className="text-xl font-semibold text-brand-purple">Cookies, analytics, and third parties</h2><p className="mt-3">The website owner should confirm whether analytics, cookies, embedded content, hosting services, or other third parties are used and update this draft accordingly.</p></section>
        <section><h2 className="text-xl font-semibold text-brand-purple">Questions or requests</h2><p className="mt-3">A verified privacy contact has not been provided. Add the appropriate contact route before treating this notice as final.</p></section>
        <p className="text-xs text-brand-ink/55">Last reviewed: pending. Legal review required before launch.</p>
      </article>
    </>
  );
}
