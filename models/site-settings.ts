import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const siteSettingsSchema = new Schema({
  _id: { type: String, default: "public" },
  contact: {
    email: { type: String, maxlength: 254, lowercase: true, trim: true },
    phone: { type: String, maxlength: 30, trim: true },
    address: { type: String, maxlength: 300, trim: true },
  },
  socialLinks: {
    linkedin: { type: String, maxlength: 2048 },
    instagram: { type: String, maxlength: 2048 },
    facebook: { type: String, maxlength: 2048 },
    x: { type: String, maxlength: 2048 },
  },
  logo: { type: String, maxlength: 2048 },
  seoDefaults: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 180 },
  },
}, { timestamps: true, strict: "throw", versionKey: false });

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;
export const SiteSettings = (models.SiteSettings as Model<SiteSettingsDocument> | undefined)
  ?? model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);
