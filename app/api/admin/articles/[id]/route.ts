import { createAdminContentDetailHandlers } from "@/lib/api/content-handlers";
import { articleSchema } from "@/lib/validation/content";
import { Article } from "@/models/article";

export const runtime = "nodejs";
const handlers = createAdminContentDetailHandlers(Article, articleSchema, articleSchema.partial(), { publicationDate: true });
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
