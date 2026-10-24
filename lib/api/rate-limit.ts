import "server-only";
import { createHash } from "node:crypto";
import { RateLimit } from "@/models/rate-limit";
import { ApiError } from "@/lib/api/http";
import { connectMongo } from "@/lib/db/mongodb";

export async function enforceRateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  const address = request.headers.get("x-real-ip")?.trim()
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  await incrementLimit(scope, address, limit, windowSeconds);
}

export async function enforceIdentifierRateLimit(scope: string, identifier: string, limit: number, windowSeconds: number) {
  await incrementLimit(scope, identifier, limit, windowSeconds);
}

async function incrementLimit(scope: string, identifier: string, limit: number, windowSeconds: number) {
  const addressHash = createHash("sha256").update(identifier).digest("hex");
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `${scope}:${addressHash}:${bucket}`;
  const expiresAt = new Date((bucket + 2) * windowSeconds * 1000);
  await connectMongo();
  let entry;
  try {
    entry = await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      entry = await RateLimit.findOneAndUpdate(
        { key },
        { $inc: { count: 1 } },
        { new: true },
      ).lean();
    } else {
      throw error;
    }
  }
  if (!entry) throw new ApiError("Request limits are temporarily unavailable.", 503);
  if (entry.count > limit) throw new ApiError("Too many requests. Please try again later.", 429);
}
