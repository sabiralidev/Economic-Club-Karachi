import { Article } from "@/models/article";
import { createPublicContentHandlers } from "@/lib/api/content-handlers";

export const runtime = "nodejs";
export const GET = createPublicContentHandlers(Article, {
  collection: "articles",
  listProjection: "title slug excerpt featuredImage category tags publishedAt author seo.title seo.description",
  sort: { publishedAt: -1, _id: -1 },
}).GET;
