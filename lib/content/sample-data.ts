import articlesData from "@/data/articles.json";
import galleryData from "@/data/gallery.json";
import membershipData from "@/data/memberships.json";
import servicesData from "@/data/services.json";
import eventsData from "@/data/events.json";
import type {
  ArticleContent,
  ArticleSummary,
  EventContent,
  EventSummary,
  GalleryContent,
  PageResult,
  PublicPageQuery,
  ServiceContent,
  ServiceSummary,
} from "@/lib/content/database";

const sampleTimestamp = "2026-01-01T00:00:00.000Z";
const sampleImages = [
  "/images/community-dialogue.jpg",
  "/images/conversation.jpg",
  "/images/ideas-workspace.jpg",
  "/images/karachi-business.jpg",
];
const articleImages = [
  "/images/karachi-business.jpg",
  "/images/ideas-workspace.jpg",
  "/images/conversation.jpg",
  "/images/community-dialogue.jpg",
];

export function sampleArticles(query: PublicPageQuery = {}): PageResult<ArticleSummary> {
  const records = sampleArticleRecords();
  const filtered = records.filter((article) =>
    matchesCategory(article.category, query.category)
    && matchesText([article.title, article.excerpt, article.body, ...article.tags], query.q)
    && (!query.tag || article.tags.includes(query.tag.trim())),
  );
  const sorted = [...filtered];
  if (query.sort === "oldest") sorted.reverse();
  if (query.sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  return paginate(sorted.map(toArticleSummary), query);
}

export function sampleArticleBySlug(slug: string): ArticleContent | null {
  return sampleArticleRecords().find((article) => article.slug === slug) ?? null;
}

export function sampleServices(query: PublicPageQuery = {}): PageResult<ServiceSummary> {
  const records: ServiceContent[] = servicesData
    .filter((service) => service.published && !service.archived)
    .map((service, index) => ({
      ...service,
      id: `sample-service-${service.slug}`,
      image: sampleImages[index % sampleImages.length],
      createdAt: sampleTimestamp,
      updatedAt: sampleTimestamp,
    }));
  const filtered = records.filter((service) =>
    matchesCategory(service.category, query.category)
    && matchesText([service.title, service.summary, service.description, service.category], query.q),
  );
  const sorted = [...filtered];
  if (query.sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (query.sort === "oldest") sorted.reverse();
  return paginate(sorted.map(toServiceSummary), query);
}

export function sampleServiceBySlug(slug: string): ServiceContent | null {
  const service = servicesData.find((record) => record.slug === slug && record.published && !record.archived);
  if (!service) return null;
  const index = servicesData.indexOf(service);
  return { ...service, id: `sample-service-${service.slug}`, image: sampleImages[index % sampleImages.length], createdAt: sampleTimestamp, updatedAt: sampleTimestamp };
}

export function sampleEvents(query: PublicPageQuery = {}): PageResult<EventSummary> {
  const records: EventContent[] = eventsData
    .filter((event) => event.published && !event.archived)
    .map((event, index) => ({
      ...event,
      id: `sample-event-${event.slug}`,
      image: sampleImages[index % sampleImages.length],
      venue: undefined,
      status: event.status === "past" || event.status === "cancelled" ? event.status : "upcoming",
      registration: { enabled: false },
      createdAt: sampleTimestamp,
      updatedAt: sampleTimestamp,
    }));
  const filtered = records.filter((event) =>
    matchesCategory(event.category, query.category)
    && matchesText([event.title, event.summary, event.description, event.category], query.q)
    && event.status === (query.status ?? "upcoming")
    && (!query.from || event.startDate >= `${query.from}T00:00:00.000Z`)
    && (!query.to || event.startDate < `${addOneDay(query.to)}T00:00:00.000Z`),
  );
  const sorted = [...filtered];
  sorted.sort((a, b) => query.sort === "newest"
    ? b.startDate.localeCompare(a.startDate)
    : a.startDate.localeCompare(b.startDate));
  return paginate(sorted.map(toEventSummary), query);
}

export function sampleEventBySlug(slug: string): EventContent | null {
  const event = eventsData.find((record) => record.slug === slug && record.published && !record.archived);
  if (!event) return null;
  const index = eventsData.indexOf(event);
  return {
    ...event,
    id: `sample-event-${event.slug}`,
    image: sampleImages[index % sampleImages.length],
    venue: undefined,
    status: event.status === "past" || event.status === "cancelled" ? event.status : "upcoming",
    registration: { enabled: false },
    createdAt: sampleTimestamp,
    updatedAt: sampleTimestamp,
  };
}

export function sampleGalleries(query: PublicPageQuery = {}): PageResult<GalleryContent> {
  let imageIndex = 0;
  const records: GalleryContent[] = galleryData
    .filter((gallery) => gallery.published && !gallery.archived)
    .map((gallery) => ({
      ...gallery,
      id: `sample-gallery-${gallery.slug}`,
      images: gallery.images.map((image) => ({
        ...image,
        src: sampleImages[imageIndex++ % sampleImages.length],
      })),
      createdAt: sampleTimestamp,
      updatedAt: sampleTimestamp,
    }));
  const filtered = records.filter((gallery) =>
    matchesCategory(gallery.category, query.category)
    && matchesText([gallery.title, gallery.description, gallery.category], query.q),
  );
  const sorted = [...filtered];
  if (query.sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (query.sort === "oldest") sorted.reverse();
  return paginate(sorted, query);
}

export function sampleGalleryBySlug(slug: string): GalleryContent | null {
  const gallery = sampleGalleries({ limit: "100" }).items.find((record) => record.slug === slug);
  return gallery ?? null;
}

export const sampleMemberships = membershipData.filter((membership) => membership.active);

function sampleArticleRecords(): ArticleContent[] {
  return articlesData
    .filter((article) => article.published && !article.archived)
    .map((article, index) => ({
      ...article,
      id: `sample-article-${article.slug}`,
      featuredImage: articleImages[index % articleImages.length],
      publishedAt: `2026-10-${String(20 - index).padStart(2, "0")}T10:00:00.000Z`,
      createdAt: sampleTimestamp,
      updatedAt: sampleTimestamp,
    }));
}

function toArticleSummary(article: ArticleContent): ArticleSummary {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    featuredImage: article.featuredImage,
    category: article.category,
    tags: article.tags,
    publishedAt: article.publishedAt,
    seo: article.seo,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

function toServiceSummary(service: ServiceContent): ServiceSummary {
  return {
    id: service.id,
    title: service.title,
    slug: service.slug,
    summary: service.summary,
    category: service.category,
    image: service.image,
    seo: service.seo,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

function toEventSummary(event: EventContent): EventSummary {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    summary: event.summary,
    image: event.image,
    category: event.category,
    venue: event.venue,
    startDate: event.startDate,
    endDate: event.endDate,
    status: event.status,
    registration: event.registration,
    seo: event.seo,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

function matchesCategory(value: string | undefined, category: string | undefined): boolean {
  return !category || value === category.trim();
}

function matchesText(values: (string | undefined)[], query: string | undefined): boolean {
  if (!query) return true;
  const terms = query.trim().toLocaleLowerCase().split(/\s+/);
  const content = values.filter(Boolean).join(" ").toLocaleLowerCase();
  return terms.every((term) => content.includes(term));
}

function paginate<T>(items: T[], query: PublicPageQuery): PageResult<T> {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 12;
  return {
    items: items.slice((page - 1) * limit, page * limit),
    page,
    limit,
    total: items.length,
    pages: Math.ceil(items.length / limit),
  };
}

function addOneDay(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}
