import { InsightsBrowser } from "@/components/insights/insights-browser";
import { PageHero } from "@/components/public/page-hero";
import { InquiryForm } from "@/components/home/inquiry-form";
import { listArticles, type PublicPageQuery } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News and Insights",
  description: "Read published news and insights from Economic Club Karachi.",
  path: "/insights",
});

type InsightsPageProps = { searchParams: Promise<PublicPageQuery> };

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const query = await searchParams;
  let unavailable = false;
  let result;
  try {
    result = await listArticles(query);
  } catch {
    unavailable = true;
    result = { items: [], page: 1, limit: 12, total: 0, pages: 0 };
  }
  return (
    <>
      <PageHero eyebrow="News & insights" title="Ideas for a considered conversation." description="Search published articles, news and perspectives from Economic Club Karachi." />
      <section className="bg-brand-paper py-14 sm:py-18"><div className="mx-auto max-w-content px-5 sm:px-8"><InsightsBrowser result={result} query={query} unavailable={unavailable} /></div></section>
      <section className="bg-white py-14 sm:py-18"><div className="mx-auto grid max-w-content gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e716b]">Get in touch</p><h2 className="font-display mt-4 text-3xl text-brand-purple">Ask ECK about its work.</h2></div><InquiryForm defaultPurpose="general" defaultMessage="I would like to learn more about ECK's current work." /></div></section>
    </>
  );
}
