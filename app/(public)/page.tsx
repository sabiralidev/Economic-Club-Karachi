import { EngagementSection } from "@/components/home/engagement-section";
import { EventsSection } from "@/components/home/events-section";
import { HeroSection } from "@/components/home/hero-section";
import { ImpactSection } from "@/components/home/impact-section";
import { InsightsSection } from "@/components/home/insights-section";
import { IntroductionSection } from "@/components/home/introduction-section";
import { MembershipSection } from "@/components/home/membership-section";
import { ServicesSection } from "@/components/home/services-section";
import { listArticles, listEvents, listServices } from "@/lib/content/database";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Economic Club Karachi",
  description: "Learn about Economic Club Karachi, described on its public profile as a growing welfare organization, and ask about its current work.",
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [services, events, articles] = await Promise.allSettled([
    listServices({ limit: "3", sort: "newest" }),
    listEvents({ limit: "2", status: "upcoming", sort: "upcoming" }),
    listArticles({ limit: "2" }),
  ]);
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <ServicesSection services={services.status === "fulfilled" ? services.value.items : []} unavailable={services.status === "rejected"} />
      <ImpactSection />
      <EventsSection events={events.status === "fulfilled" ? events.value.items : []} unavailable={events.status === "rejected"} />
      <EngagementSection />
      <InsightsSection articles={articles.status === "fulfilled" ? articles.value.items : []} unavailable={articles.status === "rejected"} />
      <MembershipSection />
    </>
  );
}
