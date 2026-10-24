import { Article } from "@/models/article";
import { createPublicContentDetailHandler } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentDetailHandler(Article, "articles");
