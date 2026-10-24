import "server-only";
import type { Model } from "mongoose";
import { apiError, ApiError, paginationFrom, readJson, serializeDocument, success } from "@/lib/api/http";
import { requireAdminUser } from "@/lib/auth/authorization";
import { connectMongo } from "@/lib/db/mongodb";
import { applicationStatusSchema, inquiryStatusSchema } from "@/lib/validation/content";

type SubmissionOptions = {
  filters: Record<string, string[]>;
};

export function createAdminSubmissionHandlers<T>(model: Model<T>, options: SubmissionOptions) {
  return {
    GET: async (request: Request) => {
      try {
        await requireAdminUser(request, ["admin"]);
        await connectMongo();
        const { page, limit, skip } = paginationFrom(request);
        const params = new URL(request.url).searchParams;
        const filter: Record<string, unknown> = {};
        for (const [field, allowedValues] of Object.entries(options.filters)) {
          const value = params.get(field);
          if (value) {
            if (!allowedValues.includes(value)) throw new ApiError(`Invalid ${field} filter.`, 400);
            filter[field] = value;
          }
        }
        const search = params.get("q")?.trim();
        if (search) {
          if (search.length > 100) throw new ApiError("Search value is too long.", 400);
          filter.$text = { $search: search };
        }
        const sort = params.get("sort");
        if (sort && sort !== "newest" && sort !== "oldest") throw new ApiError("Invalid sort option.", 400);
        const [records, total] = await Promise.all([
          model.find(filter)
            .select("-idempotencyKey -payloadHash")
            .sort({ createdAt: sort === "oldest" ? 1 : -1, _id: sort === "oldest" ? 1 : -1 })
            .skip(skip).limit(limit).lean(),
          model.countDocuments(filter),
        ]);
        return success({ items: serializeDocument(records), page, limit, total, pages: Math.ceil(total / limit) });
      } catch (error) {
        return apiError(error);
      }
    },
  };
}

export function createAdminSubmissionDetailHandlers<T>(
  model: Model<T>,
  statusSchema: typeof inquiryStatusSchema | typeof applicationStatusSchema,
) {
  return {
    GET: async (request: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        await requireAdminUser(request, ["admin"]);
        const { id } = await context.params;
        if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("Invalid record ID.", 400);
        await connectMongo();
        const record = await model.findById(id).select("-idempotencyKey -payloadHash").lean();
        if (!record) throw new ApiError("The requested record was not found.", 404);
        return success(serializeDocument(record));
      } catch (error) {
        return apiError(error);
      }
    },
    PATCH: async (request: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        await requireAdminUser(request, ["admin"]);
        const { id } = await context.params;
        if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("Invalid record ID.", 400);
        const { status } = statusSchema.parse(await readJson(request));
        await connectMongo();
        const record = await model.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
          .select("-idempotencyKey -payloadHash").lean();
        if (!record) throw new ApiError("The requested record was not found.", 404);
        return success(serializeDocument(record));
      } catch (error) {
        return apiError(error);
      }
    },
    DELETE: async (request: Request, context: { params: Promise<{ id: string }> }) => {
      try {
        await requireAdminUser(request, ["admin"]);
        const { id } = await context.params;
        if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("Invalid record ID.", 400);
        await connectMongo();
        const record = await model.findByIdAndDelete(id);
        if (!record) throw new ApiError("The requested record was not found.", 404);
        return success({ id });
      } catch (error) {
        return apiError(error);
      }
    },
  };
}
