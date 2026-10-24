import { createAdminContentDetailHandlers } from "@/lib/api/content-handlers";
import { gallerySchema } from "@/lib/validation/content";
import { Gallery } from "@/models/gallery";

export const runtime = "nodejs";
const handlers = createAdminContentDetailHandlers(Gallery, gallerySchema, gallerySchema.partial());
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
