export type EventStatus = "upcoming" | "past";
export type EventCategory = "community" | "business";

export type ECKEvent = {
  slug: string;
  title: string;
  summary: string;
  status: EventStatus;
  category: EventCategory;
  date?: string;
  location?: string;
  image?: string;
  imageAlt?: string;
  details: string[];
};

export const eckEvents: ECKEvent[] = [];