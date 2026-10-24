import "server-only";
import type { Model } from "mongoose";
import { z } from "zod";
import { apiError, ApiError, paginationFrom, readJson, serializeDocument, success } from "@/lib/api/http";
import { connectMongo } from "@/lib/db/mongodb";
import { requireAdminUser } from "@/lib/auth/authorization";

type ContentCollection = "services" | "events" | "articles" | "gallery";
type ContentOptions = {
  collection: ContentCollection;
  listProjection: string;
  sort?: Record<string, 1 | -1>;
  statusValues?: string[];
};
type Validator = { parse(input: unknown): unknown };
type AdminContentOptions = {
  statusValues?: string[];
  publicationDate?: boolean;
};

export function createPublicContentHandlers<T>(model: Model<T>, options: ContentOptions) {
  return {
    GET: async (request: Request) => {
      try {
        await connectMongo();
        const { page, limit, skip } = paginationFrom(request);
        const params = new URL(request.url).searchParams;
        const filter = { ...publicFilter(options.collection, params) };
        if (params.has("category")) filter.category = boundedQuery(params.get("category"), "category");
        if (options.collection === "events" && params.has("status")) {
          const status = params.get("status");
          if (status !== "upcoming" && status !== "past") throw new ApiError("Invalid event status.", 400);
          filter.status = status;
        }
        if (options.collection === "articles" && params.has("tag")) {
          filter.tags = boundedQuery(params.get("tag"), "tag", 40);
        }

        const [items, total] = await Promise.all([
          model.find(filter).select(options.listProjection).sort(getSort(params.get("sort"), options.collection, options.sort)).skip(skip).limit(limit).lean(),
          model.countDocuments(filter),
        ]);
        const publicItems = items.map((item) => {
          const serialized = serializeDocument(item);
          if (options.collection === "events" && isRecord(serialized) && serialized.venueVerified !== true) {
            delete serialized.venue;
          }
          if (options.collection === "events" && isRecord(serialized)) delete serialized.venueVerified;
          return serialized;
        });
        return success({ items: publicItems, page, limit, total, pages: Math.ceil(total / limit) });
      } catch (error) {
        return apiError(error);
      }
    },
  };
}

export function createPublicContentDetailHandler<T>(model: Model<T>, collection: ContentCollection) {
  return async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
    try {
      const { slug } = await context.params;
      const safeSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).parse(slug);
      await connectMongo();
      const filter: Record<string, unknown> = { slug: safeSlug, published: true, archived: { $ne: true } };
      if (collection === "events") filter.status = { $ne: "cancelled" };
      const item = await model.findOne(filter).lean();
      if (!item) throw new ApiError("The requested content was not found.", 404);
      const serialized = serializeDocument(item);
      if (collection === "events" && isRecord(serialized)) {
        if (serialized.venueVerified !== true) delete serialized.venue;
        delete serialized.venueVerified;
      }
      return success(serialized);
    } catch (error) {
      return apiError(error);
    }
  };
}

export function createAdminContentHandlers<T>(
  model: Model<T>,
  schema: Validator,
  options: AdminContentOptions = {},
) {
  return {
    GET: async (request: Request) => {
      try {
        await requireAdminUser(request);
        await connectMongo();
        const { page, limit, skip } = paginationFrom(request);
        const params = new URL(request.url).searchParams;
        const filter: Record<string, unknown> = {};
        if (params.has("published")) {
          const published = params.get("published");
          if (published !== "true" && published !== "false") throw new ApiError("Invalid published filter.", 400);
          filter.published = published === "true";
        }
        if (params.has("archived")) {
          const archived = params.get("archived");
          if (archived !== "true" && archived !== "false") throw new ApiError("Invalid archive filter.", 400);
          filter.archived = archived === "true";
        }
        if (params.has("category")) filter.category = boundedQuery(params.get("category"), "category");
        if (params.has("status")) {
          const status = boundedQuery(params.get("status"), "status");
          if (!options.statusValues?.includes(status)) throw new ApiError("Invalid status filter.", 400);
          filter.status = status;
        }
        if (params.has("q")) {
          const search = boundedQuery(params.get("q"), "search", 100);
          filter.$text = { $search: search };
        }
        const sort = params.get("sort");
        if (sort && sort !== "newest" && sort !== "oldest" && sort !== "title" && sort !== "updated") {
          throw new ApiError("Invalid sort option.", 400);
        }
        const [documents, total] = await Promise.all([
          model.find(filter).sort(getSort(sort, "services")).skip(skip).limit(limit).lean(),
          model.countDocuments(filter),
        ]);
        return success({
          items: serializeDocument(documents),
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        });
      } catch (error) {
        return apiError(error);
      }
    },
    POST: async (request: Request) => {
      try {
        await requireAdminUser(request);
        const payload = await readJson(request);
        const parsed = schema.parse(payload);
        if (!isRecord(parsed)) throw new ApiError("Request body must be an object.", 400);
        if (options.publicationDate && parsed.published === true && !parsed.publishedAt) {
          parsed.publishedAt = new Date().toISOString();
        }
        await connectMongo();
        const document = await model.create(parsed);
        return success(serializeDocument(document), 201);
      } catch (error) {
        return apiError(error);
      }
    },
  };
}

export function createAdminContentDetailHandlers<T>(
  model: Model<T>,
  schema: Validator,
  patchSchema: Validator,
  options: AdminContentOptions = {},
) {
  return {
    GET: async (request: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        await requireAdminUser(request);
        const { id } = await context.params;
        if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("Invalid record ID.", 400);
        await connectMongo();
        const document = await model.findById(id).lean();
        if (!document) throw new ApiError("The requested record was not found.", 404);
        return success(serializeDocument(document));
      } catch (error) {
        return apiError(error);
      }
    },
    PATCH: async (request: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        await requireAdminUser(request);
        const { id } = await context.params;
        if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("Invalid record ID.", 400);
        const body = await readJson(request);
        const patch = patchSchema.parse(body);
        if (!isRecord(patch) || Object.keys(patch).length === 0) {
          throw new ApiError("At least one field is required.", 400);
        }
        await connectMongo();
        const document = await model.findById(id);
        if (!document) throw new ApiError("The requested record was not found.", 404);
        const current = serializeDocument(document);
        if (!isRecord(current)) throw new ApiError("The requested record could not be updated.", 500);
        const merged = schema.parse({ ...current, ...patch });
        if (!isRecord(merged)) throw new ApiError("The supplied data is invalid.", 400);
        if (options.publicationDate && merged.published === true && !merged.publishedAt) {
          merged.publishedAt = new Date().toISOString();
        }
        document.set(merged);
        await document.save();
        return success(serializeDocument(document));
      } catch (error) {
        return apiError(error);
      }
    },
    DELETE: async (request: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        await requireAdminUser(request);
        const { id } = await context.params;
        if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("Invalid record ID.", 400);
        await connectMongo();
        const document = await model.findByIdAndDelete(id);
        if (!document) throw new ApiError("The requested record was not found.", 404);
        return success({ id });
      } catch (error) {
        return apiError(error);
      }
    },
  };
}

export function publicFilter(collection: ContentCollection, params: URLSearchParams): Record<string, unknown> {
  const filter: Record<string, unknown> = { published: true, archived: { $ne: true } };
  if (params.has("q")) filter.$text = { $search: boundedQuery(params.get("q"), "search", 100) };
  if (collection === "events") {
    const status = params.get("status");
    if (status === "upcoming" || status === "past") filter.status = status;
    else filter.status = { $ne: "cancelled" };
    const from = params.get("from");
    if (from) filter.startDate = { ...(isRecord(filter.startDate) ? filter.startDate : {}), $gte: parseDateFilter(from) };
    const to = params.get("to");
    if (to) filter.startDate = { ...(isRecord(filter.startDate) ? filter.startDate : {}), $lte: parseDateFilter(to) };
  }
  return filter;
}

function boundedQuery(value: string | null, label: string, maxLength = 80): string {
  const result = value?.trim() ?? "";
  if (!result || result.length > maxLength) throw new ApiError(`Invalid ${label} filter.`, 400);
  return result;
}

function parseDateFilter(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(value)) {
    throw new ApiError("Event date filters must be valid ISO dates.", 400);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value.slice(0, 10)) {
    throw new ApiError("Event date filters must be valid ISO dates.", 400);
  }
  return date;
}

function getSort(
  value: string | null,
  collection: ContentCollection,
  fallback: Record<string, 1 | -1> = { updatedAt: -1, _id: -1 },
) {
  if (!value) return fallback;
  const sorts: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    title: { title: 1, _id: 1 },
    updated: { updatedAt: -1, _id: -1 },
    ...(collection === "events" ? { upcoming: { startDate: 1, _id: 1 } } : {}),
    ...(collection === "articles" ? { published: { publishedAt: -1, _id: -1 } } : {}),
  };
  const sort = sorts[value];
  if (!sort) throw new ApiError("Invalid sort option.", 400);
  return sort;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
