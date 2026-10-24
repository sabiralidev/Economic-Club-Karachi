import { Event } from "@/models/event";
import { createPublicContentHandlers } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentHandlers(Event, {
  collection: "events",
  listProjection: "title slug summary image startDate endDate status venue venueVerified registration.enabled seo.title seo.description",
  sort: { startDate: 1, _id: 1 },
}).GET;
