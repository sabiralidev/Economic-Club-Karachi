import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const membershipApplicationSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30 },
  interest: { type: String, enum: ["membership", "volunteering", "partnership", "general"], required: true },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  consent: { type: Boolean, required: true, validate: (value: boolean) => value === true },
  status: { type: String, enum: ["new", "reviewing", "accepted", "declined", "closed"], default: "new", required: true },
  idempotencyKey: { type: String, select: false },
  payloadHash: { type: String, select: false },
}, { timestamps: true, strict: "throw" });

membershipApplicationSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
membershipApplicationSchema.index({ status: 1, createdAt: -1 });
membershipApplicationSchema.index({ email: 1, createdAt: -1 });
membershipApplicationSchema.index({ name: "text", email: "text", message: "text" });

export type MembershipApplicationDocument = InferSchemaType<typeof membershipApplicationSchema>;
export const MembershipApplication = (models.MembershipApplication as Model<MembershipApplicationDocument> | undefined)
  ?? model<MembershipApplicationDocument>("MembershipApplication", membershipApplicationSchema);
