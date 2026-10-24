import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  summary: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, required: true, trim: true, maxlength: 20_000 },
  image: { type: String, maxlength: 2048 },
  venue: { type: String, trim: true, maxlength: 200 },
  venueVerified: { type: Boolean, default: false, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ["upcoming", "past", "cancelled"], default: "upcoming", required: true },
  registration: {
    enabled: { type: Boolean, default: false, required: true },
  },
  published: { type: Boolean, default: false, required: true },
  archived: { type: Boolean, default: false, required: true },
  seo: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 180 },
    canonicalUrl: { type: String, maxlength: 2048 },
  },
}, { timestamps: true, strict: "throw" });

eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ published: 1, archived: 1, status: 1, startDate: 1 });
eventSchema.index({ title: "text", summary: "text", description: "text" });

export type EventDocument = InferSchemaType<typeof eventSchema>;
export const Event = (models.Event as Model<EventDocument> | undefined)
  ?? model<EventDocument>("Event", eventSchema);
