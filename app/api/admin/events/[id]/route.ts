import { createAdminContentDetailHandlers } from "@/lib/api/content-handlers";
import { eventPatchSchema, eventSchema } from "@/lib/validation/content";
import { Event } from "@/models/event";

export const runtime = "nodejs";
const handlers = createAdminContentDetailHandlers(Event, eventSchema, eventPatchSchema);
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
