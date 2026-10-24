import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { z } from "zod";
import { connectMongo } from "@/lib/db/mongodb";
import { hashPassword } from "@/lib/auth/password";
import { AdminUser } from "@/models/admin-user";

async function main() {
  loadEnvConfig(process.cwd());
  const configuration = z.object({
    MONGODB_URI: z.string().min(1),
    ADMIN_BOOTSTRAP_EMAIL: z.email(),
    ADMIN_BOOTSTRAP_PASSWORD: z.string().min(16).max(128),
  }).parse(process.env);

  const { MONGODB_URI, ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD } = configuration;
  const email = ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
  const password = ADMIN_BOOTSTRAP_PASSWORD;
  if (!MONGODB_URI.startsWith("mongodb://") && !MONGODB_URI.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI must be a valid MongoDB connection string.");
  }

  await connectMongo();
  const existing = await AdminUser.exists({ email });
  if (existing) throw new Error("An administrator account with this email already exists.");
  await AdminUser.create({ email, passwordHash: await hashPassword(password), role: "admin", status: "active" });
  console.info("Administrator account created.");
}

main()
  .catch((error: unknown) => {
    console.error("Admin bootstrap failed:", error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
