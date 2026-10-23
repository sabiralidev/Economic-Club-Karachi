import { RoutePlaceholder } from "@/components/route-placeholder";

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RoutePlaceholder title={slug.replaceAll("-", " ")} description="A closer look at this Economic Club Karachi event or community initiative." />;
}
