import { Service } from "@/models/service";
import { createPublicContentHandlers } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentHandlers(Service, {
  collection: "services",
  listProjection: "title slug summary category image seo.title seo.description updatedAt",
}).GET;
