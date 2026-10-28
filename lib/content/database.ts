import "server-only";
import { Article } from "@/models/article";
import { Event } from "@/models/event";
import { Gallery } from "@/models/gallery";
import { Service } from "@/models/service";
import { SiteSettings } from "@/models/site-settings";
import { connectMongo } from "@/lib/db/mongodb";
import {
  sampleArticleBySlug,
  sampleArticles,
  sampleEventBySlug,
  sampleEvents,
  sampleGalleryBySlug,
  sampleGalleries,
  sampleServiceBySlug,
  sampleServices,
} from "@/lib/content/sample-data";

export type PageResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type ServiceContent = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: string;
  image?: string;
  seo?: { title?: string; description?: string; canonicalUrl?: string };
  createdAt: string;
  updatedAt: string;
};
export type ServiceSummary = Omit<ServiceContent, "description">;

export type EventContent = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image?: string;
  category?: string;
  venue?: string;
  startDate: string;
  endDate?: string;
  status: "upcoming" | "past" | "cancelled";
  registration: { enabled: boolean };
  seo?: { title?: string; description?: string; canonicalUrl?: string };
  createdAt: string;
  updatedAt: string;
};
export type EventSummary = Omit<EventContent, "description">;

export type ArticleContent = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  publishedAt?: string;
  seo?: { title?: string; description?: string; canonicalUrl?: string };
  createdAt: string;
  updatedAt: string;
};
export type ArticleSummary = Omit<ArticleContent, "body">;

export type GalleryContent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: { src: string; alt: string; caption?: string }[];
  category: string;
  seo?: { title?: string; description?: string; canonicalUrl?: string };
  createdAt: string;
  updatedAt: string;
};

export type PublicSiteSettings = {
  contact?: { email?: string; phone?: string; address?: string };
  socialLinks?: { linkedin?: string; instagram?: string; facebook?: string; x?: string };
  logo?: string;
  seoDefaults?: { title?: string; description?: string };
};

export type PublicPageQuery = {
  page?: string;
  limit?: string;
  category?: string;
  q?: string;
  sort?: string;
  tag?: string;
  status?: string;
  from?: string;
  to?: string;
};

export async function listServices(query: PublicPageQuery = {}): Promise<PageResult<ServiceSummary>> {
  const page = pageNumber(query.page);
  const limit = pageLimit(query.limit);
  const filter = publishedFilter();
  addCategory(filter, query.category);
  addText(filter, query.q);
  const sort = sortOption(
    query.sort,
    { newest: { createdAt: -1, _id: -1 }, oldest: { createdAt: 1, _id: 1 }, title: { title: 1, _id: 1 } },
    { updatedAt: -1, _id: -1 },
  );

  return paginate({
    section: "services",
    page,
    limit,
    sample: () => sampleServices(query),
    query: () => Promise.all([
      Service.find(filter)
        .select("title slug summary category image seo createdAt updatedAt")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Service.countDocuments(filter),
      Service.countDocuments(publishedFilter()),
    ]),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      category: record.category,
      image: optionalString(record.image),
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function getServiceBySlug(slug: string): Promise<ServiceContent | null> {
  return findBySlug({
    section: "services",
    sample: () => sampleServiceBySlug(slug),
    query: () => Service.findOne(publishedFilter({ slug }))
      .select("title slug summary description category image seo createdAt updatedAt")
      .lean(),
    count: () => Service.countDocuments(publishedFilter()),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      description: record.description,
      category: record.category,
      image: optionalString(record.image),
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function listEvents(query: PublicPageQuery = {}): Promise<PageResult<EventSummary>> {
  const page = pageNumber(query.page);
  const limit = pageLimit(query.limit);
  const filter = publishedEventFilter();
  addCategory(filter, query.category);
  addText(filter, query.q);
  if (query.status && query.status !== "upcoming" && query.status !== "past") {
    throw new Error("Invalid event status filter.");
  }
  filter.status = query.status ?? "upcoming";
  if (query.from || query.to) {
    const range: Record<string, Date> = {};
    if (query.from) range.$gte = dateFilter(query.from, "from");
    if (query.to) range.$lt = new Date(dateFilter(query.to, "to").getTime() + 24 * 60 * 60 * 1000);
    if (range.$gte && range.$lt && range.$gte >= range.$lt) {
      throw new Error("Event start date range is invalid.");
    }
    filter.startDate = range;
  }
  const sort = sortOption(
    query.sort,
    {
      newest: { startDate: -1, _id: -1 },
      oldest: { startDate: 1, _id: 1 },
      upcoming: { startDate: 1, _id: 1 },
    },
    { startDate: 1, _id: 1 },
  );

  return paginate({
    section: "events",
    page,
    limit,
    sample: () => sampleEvents(query),
    query: () => Promise.all([
      Event.find(filter)
        .select("title slug summary image category venue venueVerified startDate endDate status registration seo createdAt updatedAt")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(filter),
      Event.countDocuments(publishedEventFilter()),
    ]),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      image: optionalString(record.image),
      category: optionalString(record.category),
      venue: record.venueVerified ? optionalString(record.venue) : undefined,
      startDate: record.startDate.toISOString(),
      endDate: record.endDate?.toISOString(),
      status: record.status,
      registration: record.registration ?? { enabled: false },
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function getEventBySlug(slug: string): Promise<EventContent | null> {
  return findBySlug({
    section: "events",
    sample: () => sampleEventBySlug(slug),
    query: () => Event.findOne(publishedEventFilter({ slug }))
      .select("title slug summary description image category venue venueVerified startDate endDate status registration seo createdAt updatedAt")
      .lean(),
    count: () => Event.countDocuments(publishedEventFilter()),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      description: record.description,
      image: optionalString(record.image),
      category: optionalString(record.category),
      venue: record.venueVerified ? optionalString(record.venue) : undefined,
      startDate: record.startDate.toISOString(),
      endDate: record.endDate?.toISOString(),
      status: record.status,
      registration: record.registration ?? { enabled: false },
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function listArticles(query: PublicPageQuery = {}): Promise<PageResult<ArticleSummary>> {
  const page = pageNumber(query.page);
  const limit = pageLimit(query.limit);
  const filter = publishedArticleFilter();
  addCategory(filter, query.category);
  addText(filter, query.q);
  if (query.tag) filter.tags = bounded(query.tag, 40, "tag");
  const sort = sortOption(
    query.sort,
    { oldest: { publishedAt: 1, _id: 1 }, title: { title: 1, _id: 1 } },
    { publishedAt: -1, _id: -1 },
  );

  return paginate({
    section: "insights",
    page,
    limit,
    sample: () => sampleArticles(query),
    query: () => Promise.all([
      Article.find(filter)
        .select("title slug excerpt featuredImage category tags publishedAt seo createdAt updatedAt")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Article.countDocuments(filter),
      Article.countDocuments(publishedArticleFilter()),
    ]),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      excerpt: record.excerpt,
      featuredImage: optionalString(record.featuredImage),
      category: record.category,
      tags: record.tags,
      publishedAt: record.publishedAt?.toISOString(),
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function getArticleBySlug(slug: string): Promise<ArticleContent | null> {
  return findBySlug({
    section: "insights",
    sample: () => sampleArticleBySlug(slug),
    query: () => Article.findOne(publishedArticleFilter({ slug }))
      .select("title slug excerpt body featuredImage category tags publishedAt seo createdAt updatedAt")
      .lean(),
    count: () => Article.countDocuments(publishedArticleFilter()),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      excerpt: record.excerpt,
      body: record.body,
      featuredImage: optionalString(record.featuredImage),
      category: record.category,
      tags: record.tags,
      publishedAt: record.publishedAt?.toISOString(),
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function listGallery(query: PublicPageQuery = {}): Promise<PageResult<GalleryContent>> {
  const page = pageNumber(query.page);
  const limit = pageLimit(query.limit);
  const filter = publishedFilter();
  addCategory(filter, query.category);
  addText(filter, query.q);
  const sort = sortOption(
    query.sort,
    { newest: { createdAt: -1, _id: -1 }, oldest: { createdAt: 1, _id: 1 }, title: { title: 1, _id: 1 } },
    { updatedAt: -1, _id: -1 },
  );

  return paginate({
    section: "gallery",
    page,
    limit,
    sample: () => sampleGalleries(query),
    query: () => Promise.all([
      Gallery.find(filter)
        .select("title slug description images category seo createdAt updatedAt")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Gallery.countDocuments(filter),
      Gallery.countDocuments(publishedFilter()),
    ]),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      description: record.description,
      images: galleryImages(record.images),
      category: record.category,
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function getGalleryBySlug(slug: string): Promise<GalleryContent | null> {
  return findBySlug({
    section: "gallery",
    sample: () => sampleGalleryBySlug(slug),
    query: () => Gallery.findOne(publishedFilter({ slug }))
      .select("title slug description images category seo createdAt updatedAt")
      .lean(),
    count: () => Gallery.countDocuments(publishedFilter()),
    map: (record) => ({
      id: record._id.toString(),
      title: record.title,
      slug: record.slug,
      description: record.description,
      images: galleryImages(record.images),
      category: record.category,
      seo: seoContent(record.seo),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  });
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings | null> {
  await connectMongo();
  const settings = await SiteSettings.findById("public").select("contact socialLinks logo seoDefaults").lean();
  if (!settings) return null;
  return {
    contact: settings.contact ? {
      email: optionalString(settings.contact.email), phone: optionalString(settings.contact.phone),
      address: optionalString(settings.contact.address),
    } : undefined,
    socialLinks: settings.socialLinks ? {
      linkedin: optionalString(settings.socialLinks.linkedin), instagram: optionalString(settings.socialLinks.instagram),
      facebook: optionalString(settings.socialLinks.facebook), x: optionalString(settings.socialLinks.x),
    } : undefined,
    logo: optionalString(settings.logo),
    seoDefaults: settings.seoDefaults ? {
      title: optionalString(settings.seoDefaults.title), description: optionalString(settings.seoDefaults.description),
    } : undefined,
  };
}

type PaginateConfig<TRecord, TItem> = {
  section: string;
  page: number;
  limit: number;
  /** Runs the paginated find + counts. Only executed once MongoDB is reachable. */
  query: () => Promise<[TRecord[], number, number]>;
  /** Sample fallback used when the database is unavailable or holds no published records. */
  sample: () => PageResult<TItem>;
  map: (record: TRecord) => TItem;
};

async function paginate<TRecord, TItem>(config: PaginateConfig<TRecord, TItem>): Promise<PageResult<TItem>> {
  if (await connectOrUseSampleContent(config.section)) return config.sample();
  const [documents, total, publishedTotal] = await config.query();
  if (publishedTotal === 0) return config.sample();
  return pageResult(documents.map(config.map), config.page, config.limit, total);
}

type FindBySlugConfig<TRecord, TItem> = {
  section: string;
  query: () => Promise<TRecord | null>;
  count: () => Promise<number>;
  sample: () => TItem | null;
  map: (record: TRecord) => TItem;
};

async function findBySlug<TRecord, TItem>(config: FindBySlugConfig<TRecord, TItem>): Promise<TItem | null> {
  if (await connectOrUseSampleContent(config.section)) return config.sample();
  const record = await config.query();
  if (record) return config.map(record);
  const publishedTotal = await config.count();
  return publishedTotal === 0 ? config.sample() : null;
}

function publishedFilter(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return { published: true, archived: { $ne: true }, ...extra };
}

function publishedEventFilter(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return { published: true, archived: { $ne: true }, status: { $ne: "cancelled" }, ...extra };
}

function publishedArticleFilter(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return { published: true, archived: { $ne: true }, publishedAt: { $lte: new Date() }, ...extra };
}

function galleryImages(images: { src: string; alt: string; caption?: string | null }[]): GalleryContent["images"] {
  return Array.from(images, (image) => ({
    src: image.src,
    alt: image.alt,
    caption: optionalString(image.caption),
  }));
}

function optionalString(value: string | null | undefined): string | undefined {
  return value ?? undefined;
}

async function connectOrUseSampleContent(section: string): Promise<boolean> {
  try {
    await connectMongo();
    return false;
  } catch (error) {
    if (!(error instanceof Error) || !isDatabaseUnavailable(error)) throw error;
    console.warn(`MongoDB unavailable; serving sample ${section} content.`);
    return true;
  }
}

function isDatabaseUnavailable(error: Error): boolean {
  return error.name === "DatabaseConfigurationError"
    || error.message === "MONGODB_URI is required to use MongoDB-backed features."
    || ["MongoServerSelectionError", "MongooseServerSelectionError", "MongoNetworkError", "MongoNetworkTimeoutError"].includes(error.name);
}

function seoContent(value: {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
} | null | undefined): ServiceContent["seo"] {
  if (!value) return undefined;
  return {
    title: optionalString(value.title),
    description: optionalString(value.description),
    canonicalUrl: optionalString(value.canonicalUrl),
  };
}

function pageResult<T>(items: T[], page: number, limit: number, total: number): PageResult<T> {
  return { items, page, limit, total, pages: Math.ceil(total / limit) };
}

function pageNumber(value?: string): number {
  if (!value) return 1;
  if (!/^\d+$/.test(value)) throw new Error("Page must be a positive integer.");
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1_000_000) throw new Error("Page must be a positive integer.");
  return page;
}

function pageLimit(value?: string): number {
  if (!value) return 12;
  if (!/^\d+$/.test(value)) throw new Error("Limit must be between 1 and 100.");
  const limit = Number(value);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new Error("Limit must be between 1 and 100.");
  return limit;
}

function addCategory(filter: Record<string, unknown>, category?: string) {
  if (category) filter.category = bounded(category, 80, "category");
}

function addText(filter: Record<string, unknown>, query?: string) {
  if (query) filter.$text = { $search: bounded(query, 100, "search") };
}

function bounded(value: string, maximum: number, label: string): string {
  const result = value.trim();
  if (!result || result.length > maximum) throw new Error(`Invalid ${label} filter.`);
  return result;
}

function dateFilter(value: string, label: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid ${label} event date filter.`);
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid ${label} event date filter.`);
  }
  return date;
}

function sortOption(
  value: string | undefined,
  options: Record<string, Record<string, 1 | -1>>,
  fallback: Record<string, 1 | -1>,
): Record<string, 1 | -1> {
  if (!value) return fallback;
  const sort = options[value];
  if (!sort) throw new Error("Invalid sort option.");
  return sort;
}
