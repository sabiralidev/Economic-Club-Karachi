import { createAdminContentHandlers } from "@/lib/api/content-handlers";
import { eventSchema } from "@/lib/validation/content";
import { Event } from "@/models/event";

export const runtime = "nodejs";
const handlers = createAdminContentHandlers(Event, eventSchema, { statusValues: ["upcoming", "past", "cancelled"] });
export const GET = handlers.GET;
export const POST = handlers.POST;
