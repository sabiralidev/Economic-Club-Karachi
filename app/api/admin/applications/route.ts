import { createAdminSubmissionHandlers } from "@/lib/api/admin-submissions";
import { MembershipApplication } from "@/models/membership-application";

export const runtime = "nodejs";
export const GET = createAdminSubmissionHandlers(MembershipApplication, {
  filters: {
    status: ["new", "reviewing", "accepted", "declined", "closed"],
    interest: ["membership", "volunteering", "partnership", "general"],
  },
}).GET;
