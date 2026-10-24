export type GalleryCategory = "events" | "community" | "people";

export type GalleryItem = {
  slug: string;
  title: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  caption?: string;
};

export const galleryItems: GalleryItem[] = [];