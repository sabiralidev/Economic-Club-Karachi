import { EngagementSection } from "@/components/home/engagement-section";
import { EventsSection } from "@/components/home/events-section";
import { HeroSection } from "@/components/home/hero-section";
import { ImpactSection } from "@/components/home/impact-section";
import { InsightsSection } from "@/components/home/insights-section";
import { IntroductionSection } from "@/components/home/introduction-section";
import { MembershipSection } from "@/components/home/membership-section";
import { ServicesSection } from "@/components/home/services-section";

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
