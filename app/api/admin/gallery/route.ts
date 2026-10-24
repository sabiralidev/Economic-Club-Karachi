import { createAdminContentHandlers } from "@/lib/api/content-handlers";
import { gallerySchema } from "@/lib/validation/content";
import { Gallery } from "@/models/gallery";

export const runtime = "nodejs";
const handlers = createAdminContentHandlers(Gallery, gallerySchema);
export const GET = handlers.GET;
export const POST = handlers.POST;
