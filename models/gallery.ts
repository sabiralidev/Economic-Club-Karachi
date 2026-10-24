import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const gallerySchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 3000, default: "" },
  images: {
    type: [{
      src: { type: String, required: true, maxlength: 2048 },
      alt: { type: String, required: true, trim: true, maxlength: 300 },
      caption: { type: String, trim: true, maxlength: 500 },
    }],
    required: true,
    validate: [(value: unknown[]) => value.length > 0 && value.length <= 100, "A gallery must contain 1 to 100 images."],
  },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  published: { type: Boolean, default: false, required: true },
  archived: { type: Boolean, default: false, required: true },
  seo: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 180 },
    canonicalUrl: { type: String, maxlength: 2048 },
  },
}, { timestamps: true, strict: "throw" });

gallerySchema.index({ slug: 1 }, { unique: true });
gallerySchema.index({ published: 1, archived: 1, category: 1, updatedAt: -1 });
gallerySchema.index({ title: "text", description: "text" });

export type GalleryDocument = InferSchemaType<typeof gallerySchema>;
export const Gallery = (models.Gallery as Model<GalleryDocument> | undefined)
  ?? model<GalleryDocument>("Gallery", gallerySchema);
