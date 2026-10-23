import { RoutePlaceholder } from "@/components/route-placeholder";

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RoutePlaceholder title={slug.replaceAll("-", " ")} description="Event information, schedule, and participation details will be published here." />;
}
