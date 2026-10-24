import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const serviceSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  summary: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, required: true, trim: true, maxlength: 20_000 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  image: { type: String, maxlength: 2048 },
  published: { type: Boolean, default: false, required: true },
  archived: { type: Boolean, default: false, required: true },
  seo: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 180 },
    canonicalUrl: { type: String, maxlength: 2048 },
  },
}, { timestamps: true, strict: "throw" });

serviceSchema.index({ slug: 1 }, { unique: true });
serviceSchema.index({ published: 1, archived: 1, category: 1, updatedAt: -1 });
serviceSchema.index({ title: "text", summary: "text", description: "text" });

export type ServiceDocument = InferSchemaType<typeof serviceSchema>;
export const Service = (models.Service as Model<ServiceDocument> | undefined)
  ?? model<ServiceDocument>("Service", serviceSchema);
