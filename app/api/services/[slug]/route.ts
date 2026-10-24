import { Service } from "@/models/service";
import { createPublicContentDetailHandler } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentDetailHandler(Service, "services");
