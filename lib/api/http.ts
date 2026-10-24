import "server-only";
import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return noStore(NextResponse.json({ data: null, error: { message: error.message } }, { status: error.status }));
  }
  if (error instanceof ZodError) {
    return noStore(NextResponse.json({
      data: null,
      error: {
        message: "Request validation failed.",
        issues: error.issues.map(({ path, message }) => ({ path, message })),
      },
    }, { status: 400 }));
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return noStore(NextResponse.json({ data: null, error: { message: "The supplied data is invalid." } }, { status: 400 }));
  }
  if (isDuplicateKeyError(error)) {
    return noStore(NextResponse.json({ data: null, error: { message: "A record with those details already exists." } }, { status: 409 }));
  }

  console.error("ECK API request failed", error instanceof Error ? error.name : "Unknown error");
  return noStore(NextResponse.json(
    { data: null, error: { message: "The request could not be completed right now." } },
    { status: isServiceUnavailable(error) ? 503 : 500 },
  ));
}

export async function readJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 64 * 1024) throw new ApiError("Request body is too large.", 413);

  const reader = request.body?.getReader();
  if (!reader) throw new ApiError("Request body is required.", 400);
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > 64 * 1024) {
        await reader.cancel();
        throw new ApiError("Request body is too large.", 413);
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Request body could not be read.", 400);
  } finally {
    reader.releaseLock();
  }

  try {
    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } catch {
    throw new ApiError("Request body must be valid JSON.", 400);
  }
}

export function paginationFrom(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = parseInteger(params.get("page"), 1, 1, 1_000_000);
  const limit = parseInteger(params.get("limit"), 20, 1, 100);
  return { page, limit, skip: (page - 1) * limit };
}

export function validObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

export function success<T>(data: T, status = 200) {
  return noStore(NextResponse.json({ data, error: null }, { status }));
}

function noStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function parseInteger(value: string | null, fallback: number, minimum: number, maximum: number): number {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) throw new ApiError("Pagination values must be positive integers.", 400);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new ApiError(`Pagination values must be between ${minimum} and ${maximum}.`, 400);
  }
  return parsed;
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

function isServiceUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "MongoServerSelectionError"
    || error.name === "MongoNetworkError"
    || error.name === "MongoNotConnectedError"
    || error.name === "DatabaseConfigurationError"
    || error.name === "ServerConfigurationError"
    || error.message.includes("MONGODB_URI is required");
}

export function serializeDocument<T>(document: T): unknown {
  if (Array.isArray(document)) return document.map((entry) => serializeDocument(entry));
  if (document === null || typeof document !== "object") return document;
  if (document instanceof Date) return document.toISOString();
  if (document instanceof Types.ObjectId) return document.toHexString();
  if ("toObject" in document && typeof document.toObject === "function") {
    return serializeDocument(document.toObject({ depopulate: true }));
  }

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(document)) {
    if (key === "__v" || key === "passwordHash" || key === "idempotencyKey" || key === "payloadHash") continue;
    output[key === "_id" ? "id" : key] = serializeDocument(value);
  }
  return output;
}
