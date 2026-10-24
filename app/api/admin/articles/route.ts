import { createAdminContentHandlers } from "@/lib/api/content-handlers";
import { articleSchema } from "@/lib/validation/content";
import { Article } from "@/models/article";

export const runtime = "nodejs";
const handlers = createAdminContentHandlers(Article, articleSchema, { publicationDate: true });
export const GET = handlers.GET;
export const POST = handlers.POST;
