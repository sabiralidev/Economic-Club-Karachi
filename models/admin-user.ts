import "server-only";
import { model, models, Schema, type Model } from "mongoose";

export type AdminUserDocument = {
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  status: "active" | "disabled";
  lastLoginAt?: Date;
};

const adminUserSchema = new Schema<AdminUserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "editor"], default: "editor", required: true },
  status: { type: String, enum: ["active", "disabled"], default: "active", required: true },
  lastLoginAt: { type: Date },
}, {
  timestamps: true,
  strict: "throw",
  toJSON: {
    transform(_document, returned) {
      Reflect.deleteProperty(returned, "passwordHash");
      Reflect.deleteProperty(returned, "__v");
      return returned;
    },
  },
});

export const AdminUser = (models.AdminUser as Model<AdminUserDocument> | undefined)
  ?? model<AdminUserDocument>("AdminUser", adminUserSchema);
