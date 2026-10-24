import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(256),
}).strict();
