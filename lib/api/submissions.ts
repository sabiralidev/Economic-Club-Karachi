import "server-only";
import { createHash } from "node:crypto";
import type { Model } from "mongoose";
import { apiError, ApiError, readJson, success } from "@/lib/api/http";
import { enforceRateLimit } from "@/lib/api/rate-limit";
import { connectMongo } from "@/lib/db/mongodb";
import { eventRegistrationSchema, membershipApplicationSchema, membershipInquirySchema, publicInquirySchema } from "@/lib/validation/inquiry";
import { Inquiry } from "@/models/inquiry";
import { MembershipApplication } from "@/models/membership-application";
import { Event } from "@/models/event";
import { z } from "zod";

export async function submitInquiry(request: Request) {
  try {
    await enforceRateLimit(request, "inquiry", 5, 15 * 60);
    const payload = await readJson(request);
    const candidate = isRecord(payload) ? payload : {};
    if (candidate.purpose === "membership") {
      const inquiry = membershipInquirySchema.parse(payload);
      const application = membershipApplicationSchema.parse({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        interest: "membership",
        message: inquiry.message,
        consent: inquiry.consent,
      });
      return await persistSubmission(MembershipApplication, application, request);
    }
    const input = publicInquirySchema.parse(payload);
    return await persistSubmission(Inquiry, input, request);
  } catch (error) {
    return apiError(error);
  }
}

export async function submitApplication(request: Request) {
  try {
    await enforceRateLimit(request, "application", 5, 15 * 60);
    const input = membershipApplicationSchema.parse(await readJson(request));
    return await persistSubmission(MembershipApplication, input, request);
  } catch (error) {
    return apiError(error);
  }
}

export async function registerForEvent(request: Request, slug: string) {
  try {
    await enforceRateLimit(request, "event-registration", 5, 15 * 60);
    const safeSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).parse(slug);
    const payload = await readJson(request);
    const input = eventRegistrationSchema.parse({
      ...(isRecord(payload) ? payload : {}),
      purpose: "event_registration",
    });
    await connectMongo();
    const event = await Event.findOne({
      slug: safeSlug,
      published: true,
      status: "upcoming",
      "registration.enabled": true,
    }).select("_id startDate").lean();
    if (!event) throw new ApiError("Registration is not available for this event.", 404);
    if (event.startDate <= new Date()) throw new ApiError("Event registration is closed.", 409);
    return await persistSubmission(Inquiry, { ...input, event: event._id, consent: true }, request);
  } catch (error) {
    return apiError(error);
  }
}

async function persistSubmission<T extends { payloadHash?: string | null; idempotencyKey?: string | null }>(
  model: Model<T>,
  input: object,
  request: Request,
) {
  const idempotencyKey = request.headers.get("idempotency-key") ?? undefined;
  if (idempotencyKey && !/^[a-zA-Z0-9._:-]{16,100}$/.test(idempotencyKey)) {
    throw new ApiError("Invalid idempotency key.", 400);
  }
  const payloadHash = idempotencyKey
    ? createHash("sha256").update(JSON.stringify(input)).digest("hex")
    : undefined;
  await connectMongo();

  if (idempotencyKey) {
    const previous = await model.findOne({ idempotencyKey }).select("+idempotencyKey +payloadHash").lean();
    if (previous) {
      if (previous.payloadHash !== payloadHash) throw new ApiError("This idempotency key was already used for another submission.", 409);
      return success({ id: String(previous._id) });
    }
  }

  try {
    const metadata = idempotencyKey ? { idempotencyKey, payloadHash } : {};
    const document = await model.create({ ...input, ...metadata });
    return success({ id: document.id }, 201);
  } catch (error) {
    if (isDuplicateKeyError(error) && idempotencyKey) {
      const previous = await model.findOne({ idempotencyKey }).select("+idempotencyKey +payloadHash").lean();
      if (previous && previous.payloadHash === payloadHash) return success({ id: String(previous._id) });
    }
    throw error;
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
