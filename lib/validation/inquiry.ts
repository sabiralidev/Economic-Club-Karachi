import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email().max(254).transform((email) => email.toLowerCase()),
  purpose: z.enum(["general", "membership", "partnership", "services", "event_registration"]),
  phone: z.string().trim().max(30).optional().transform((phone) => phone || undefined),
  message: z.string().trim().min(10, "Please add a little more detail.").max(3000),
  consent: z.boolean().optional(),
}).strict();

export type InquiryInput = z.infer<typeof inquirySchema>;

export const publicInquirySchema = inquirySchema.extend({
  purpose: z.enum(["general", "membership", "partnership", "services"]),
});

export const membershipInquirySchema = inquirySchema.extend({
  purpose: z.literal("membership"),
  consent: z.literal(true),
});

export const eventRegistrationSchema = inquirySchema.extend({
  purpose: z.literal("event_registration"),
  consent: z.literal(true),
});

export const membershipApplicationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254).transform((email) => email.toLowerCase()),
  phone: z.string().trim().max(30).optional().transform((phone) => phone || undefined),
  interest: z.enum(["membership", "volunteering", "partnership", "general"]),
  message: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
}).strict();

export type MembershipApplicationInput = z.infer<typeof membershipApplicationSchema>;