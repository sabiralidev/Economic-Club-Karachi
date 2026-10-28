import { InsightsBrowser } from "@/components/insights/insights-browser";
import { InquiryForm } from "@/components/home/inquiry-form";
import { PageHero } from "@/components/public/page-hero";
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
      <PageHero
        description="Search published articles, news and perspectives from Economic Club Karachi."
        eyebrow="News & insights"
        title="Ideas for a considered conversation."
      />

      <section className="bg-brand-paper py-14 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <InsightsBrowser query={query} result={result} unavailable={unavailable} />
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-content gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2 className="font-display mt-4 text-3xl leading-[1.1] text-brand-purple sm:text-4xl">
              Ask ECK about its work.
            </h2>
            <p className="lead mt-5 max-w-md">
              Questions about a published article or ECK’s current priorities are welcome.
            </p>
          </div>
          <InquiryForm defaultMessage="I would like to learn more about ECK's current work." defaultPurpose="general" />
        </div>
      </section>
    </>
  );
}
