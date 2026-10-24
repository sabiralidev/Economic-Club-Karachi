import { EngagementSection } from "@/components/home/engagement-section";
import { EventsSection } from "@/components/home/events-section";
import { HeroSection } from "@/components/home/hero-section";
import { ImpactSection } from "@/components/home/impact-section";
import { InsightsSection } from "@/components/home/insights-section";
import { IntroductionSection } from "@/components/home/introduction-section";
import { MembershipSection } from "@/components/home/membership-section";
import { ServicesSection } from "@/components/home/services-section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Economic Club Karachi",
  description: "Learn about Economic Club Karachi, described on its public profile as a growing welfare organization, and ask about its current work.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <ServicesSection />
      <ImpactSection />
      <EventsSection />
      <EngagementSection />
      <InsightsSection />
      <MembershipSection />
    </>
  );
}
