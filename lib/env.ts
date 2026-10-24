import "server-only";
import { z } from "zod";

const environmentSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1)
    .refine((value) => {
      try {
        const uri = new URL(value);
        return (uri.protocol === "mongodb:" || uri.protocol === "mongodb+srv:") && Boolean(uri.hostname);
      } catch {
        return false;
      }
    }, {
      message: "MONGODB_URI must use mongodb:// or mongodb+srv://.",
    })
    .optional(),
  ADMIN_SESSION_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_SITE_URL: z.url().refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }).default("http://localhost:3000"),
});

export type ServerEnvironment = z.infer<typeof environmentSchema>;

export function getServerEnvironment(): ServerEnvironment {
  return environmentSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI || undefined,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET || undefined,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  });
}
