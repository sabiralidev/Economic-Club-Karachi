import { RoutePlaceholder } from "@/components/route-placeholder";

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RoutePlaceholder title={slug.replaceAll("-", " ")} description="Read the full article and explore related perspectives from Economic Club Karachi." />;
}
