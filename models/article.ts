import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const articleSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  excerpt: { type: String, required: true, trim: true, maxlength: 600 },
  body: { type: String, required: true, trim: true, maxlength: 50_000 },
  featuredImage: { type: String, maxlength: 2048 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  tags: { type: [String], default: [], validate: [(value: string[]) => value.length <= 20, "At most 20 tags are allowed."] },
  author: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  published: { type: Boolean, default: false, required: true },
  archived: { type: Boolean, default: false, required: true },
  publishedAt: { type: Date },
  seo: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 180 },
    canonicalUrl: { type: String, maxlength: 2048 },
  },
}, { timestamps: true, strict: "throw" });

articleSchema.index({ slug: 1 }, { unique: true });
articleSchema.index({ published: 1, archived: 1, category: 1, publishedAt: -1 });
articleSchema.index({ title: "text", excerpt: "text", body: "text", tags: "text" });

export type ArticleDocument = InferSchemaType<typeof articleSchema>;
export const Article = (models.Article as Model<ArticleDocument> | undefined)
  ?? model<ArticleDocument>("Article", articleSchema);
