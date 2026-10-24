import { Gallery } from "@/models/gallery";
import { createPublicContentHandlers } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentHandlers(Gallery, {
  collection: "gallery",
  listProjection: "title slug description images category updatedAt seo.title seo.description",
}).GET;
