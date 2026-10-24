import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
}, { versionKey: false });

rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RateLimitDocument = InferSchemaType<typeof rateLimitSchema>;
export const RateLimit = (models.RateLimit as Model<RateLimitDocument> | undefined)
  ?? model<RateLimitDocument>("RateLimit", rateLimitSchema);
