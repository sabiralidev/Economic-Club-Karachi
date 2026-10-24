import "server-only";
import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100, trim: true },
    email: { type: String, required: true, maxlength: 254, lowercase: true, trim: true },
    phone: { type: String, maxlength: 30, trim: true },
    purpose: {
      type: String,
      enum: ["general", "membership", "partnership", "services", "event_registration"],
      required: true,
    },
    message: { type: String, required: true, maxlength: 3000, trim: true },
    consent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["new", "in_progress", "responded", "closed"],
      default: "new",
      required: true,
    },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    idempotencyKey: { type: String, select: false },
    payloadHash: { type: String, select: false },
  },
  { timestamps: true, strict: "throw" },
);

inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ email: 1, createdAt: -1 });
inquirySchema.index({ name: "text", email: "text", message: "text" });
inquirySchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export type InquiryDocument = InferSchemaType<typeof inquirySchema>;
export const Inquiry = (models.Inquiry as Model<InquiryDocument> | undefined)
  ?? model<InquiryDocument>("Inquiry", inquirySchema);