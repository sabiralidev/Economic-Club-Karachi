import { RoutePlaceholder } from "@/components/route-placeholder";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RoutePlaceholder title={slug.replaceAll("-", " ")} description="Service details and related opportunities will be published here." />;
}
