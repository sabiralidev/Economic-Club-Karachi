import { createAdminSubmissionDetailHandlers } from "@/lib/api/admin-submissions";
import { MembershipApplication } from "@/models/membership-application";
import { applicationStatusSchema } from "@/lib/validation/content";

export const runtime = "nodejs";
const handlers = createAdminSubmissionDetailHandlers(MembershipApplication, applicationStatusSchema);
export const GET = handlers.GET;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
