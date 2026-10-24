import Link from "next/link";
import { InsightsBrowser } from "@/components/insights/insights-browser";
import { PageHero } from "@/components/public/page-hero";
import { InquiryForm } from "@/components/home/inquiry-form";
import { insightDrafts } from "@/lib/content/insights";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News and Insights",
  description: "Search proposed Economic Club Karachi editorial drafts. All content is pending organization approval.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="News & insights · editorial drafts" title="Ideas for a considered conversation." description="Search and explore proposed article drafts. None are presented as official ECK statements or published news." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Featured draft</p><div className="mt-4 grid gap-6 border-l-2 border-brand-teal bg-white p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-ink/50">For ECK editorial review</p><h2 className="font-display mt-3 text-2xl text-brand-purple sm:text-3xl">{insightDrafts[0]?.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-brand-ink/70">{insightDrafts[0]?.summary}</p></div>{insightDrafts[0] && <Link className="editorial-link text-sm font-bold text-brand-purple underline" href={`/insights/${insightDrafts[0].slug}`}>Read draft <span aria-hidden="true" className="ml-2">↗</span></Link>}</div></div><InsightsBrowser articles={insightDrafts} /></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Updates</p><h2 className="font-display mt-4 text-3xl text-brand-purple">Ask ECK about its work.</h2><p className="mt-4 text-sm leading-6 text-brand-ink/65">A newsletter is not offered at this time. Use the contact form for a specific enquiry.</p></div><InquiryForm defaultPurpose="general" defaultMessage="I would like to learn more about ECK's current work." /></div></section>
    </>
  );
}
