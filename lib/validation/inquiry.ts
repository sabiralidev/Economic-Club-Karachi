import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email().max(254).transform((email) => email.toLowerCase()),
  purpose: z.enum(["general", "membership", "partnership", "services"]),
  message: z.string().trim().min(10, "Please add a little more detail.").max(3000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;