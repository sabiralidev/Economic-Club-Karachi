import { createAdminContentHandlers } from "@/lib/api/content-handlers";
import { serviceSchema } from "@/lib/validation/content";
import { Service } from "@/models/service";

export const runtime = "nodejs";
const handlers = createAdminContentHandlers(Service, serviceSchema);
export const GET = handlers.GET;
export const POST = handlers.POST;
