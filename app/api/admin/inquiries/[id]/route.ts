import { createAdminSubmissionDetailHandlers } from "@/lib/api/admin-submissions";
import { Inquiry } from "@/models/inquiry";
import { inquiryStatusSchema } from "@/lib/validation/content";

export const runtime = "nodejs";
const handlers = createAdminSubmissionDetailHandlers(Inquiry, inquiryStatusSchema);
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
