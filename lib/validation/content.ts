import { z } from "zod";

const slug = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const httpsUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
}, "URL must use HTTPS and cannot include credentials.");
const imagePath = z.string().trim().min(1).max(2048).refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//") && !/[\u0000-\u001f\\]/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}, "Images must use a local path or HTTPS URL.");
const seoFields = z.object({
  title: z.string().trim().max(70).optional(),
  description: z.string().trim().max(180).optional(),
  canonicalUrl: httpsUrl.optional(),
}).strict().optional();
const publicationFields = {
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
  seo: seoFields,
};

export const serviceSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug,
  summary: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(20_000),
  category: z.string().trim().min(1).max(80),
  image: imagePath.optional(),
  ...publicationFields,
}).strict();

const eventFieldsSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug,
  summary: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(20_000),
  image: imagePath.optional(),
  venue: z.string().trim().max(200).optional(),
  venueVerified: z.boolean().default(false),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  status: z.enum(["upcoming", "past", "cancelled"]).default("upcoming"),
  registration: z.object({
    enabled: z.boolean().default(false),
  }).strict().default({ enabled: false }),
  ...publicationFields,
}).strict();

export const eventSchema = eventFieldsSchema.refine(
  (event) => !event.endDate || new Date(event.endDate) >= new Date(event.startDate),
  { path: ["endDate"], message: "Event end date must not precede its start date." },
);
export const eventPatchSchema = eventFieldsSchema.partial();

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug,
  excerpt: z.string().trim().min(1).max(600),
  body: z.string().trim().min(1).max(50_000),
  featuredImage: imagePath.optional(),
  category: z.string().trim().min(1).max(80),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  author: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  published: z.boolean().default(false),
  publishedAt: z.iso.datetime().optional(),
  seo: seoFields,
}).strict();

export const gallerySchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug,
  description: z.string().trim().max(3000).default(""),
  images: z.array(z.object({
    src: imagePath,
    alt: z.string().trim().min(1).max(300),
    caption: z.string().trim().max(500).optional(),
  }).strict()).min(1).max(100),
  category: z.string().trim().min(1).max(80),
  published: z.boolean().default(false),
  seo: seoFields,
}).strict();

export const siteSettingsSchema = z.object({
  contact: z.object({
    email: z.email().max(254).optional(),
    phone: z.string().trim().max(30).optional(),
    address: z.string().trim().max(300).optional(),
  }).strict().optional(),
  socialLinks: z.object({
    linkedin: httpsUrl.optional(),
    instagram: httpsUrl.optional(),
    facebook: httpsUrl.optional(),
    x: httpsUrl.optional(),
  }).strict().optional(),
  logo: imagePath.optional(),
  seoDefaults: z.object({
    title: z.string().trim().max(70).optional(),
    description: z.string().trim().max(180).optional(),
  }).strict().optional(),
}).strict();

export const inquiryStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "responded", "closed"]),
}).strict();

export const applicationStatusSchema = z.object({
  status: z.enum(["new", "reviewing", "accepted", "declined", "closed"]),
}).strict();

export type ServiceInput = z.infer<typeof serviceSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
