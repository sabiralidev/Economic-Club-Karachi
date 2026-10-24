import { Gallery } from "@/models/gallery";
import { createPublicContentDetailHandler } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentDetailHandler(Gallery, "gallery");
