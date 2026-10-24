import { createAdminSubmissionHandlers } from "@/lib/api/admin-submissions";
import { Inquiry } from "@/models/inquiry";

export const runtime = "nodejs";
export const GET = createAdminSubmissionHandlers(Inquiry, {
  filters: {
    status: ["new", "in_progress", "responded", "closed"],
    purpose: ["general", "membership", "partnership", "services", "event_registration"],
  },
}).GET;
