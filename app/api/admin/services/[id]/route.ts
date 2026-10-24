import { createAdminContentDetailHandlers } from "@/lib/api/content-handlers";
import { serviceSchema } from "@/lib/validation/content";
import { Service } from "@/models/service";

export const runtime = "nodejs";
const handlers = createAdminContentDetailHandlers(Service, serviceSchema, serviceSchema.partial());
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
