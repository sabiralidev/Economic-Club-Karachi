import { Event } from "@/models/event";
import { createPublicContentDetailHandler } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentDetailHandler(Event, "events");
