import { model, models, Schema, type InferSchemaType } from "mongoose";

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100, trim: true },
    email: { type: String, required: true, maxlength: 254, lowercase: true, trim: true },
    purpose: {
      type: String,
      enum: ["general", "membership", "partnership", "services"],
      required: true,
    },
    message: { type: String, required: true, maxlength: 3000, trim: true },
  },
  { timestamps: true },
);

export type InquiryDocument = InferSchemaType<typeof inquirySchema>;
export const Inquiry = models.Inquiry ?? model("Inquiry", inquirySchema);