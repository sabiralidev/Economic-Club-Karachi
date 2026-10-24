import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
};

export function pageMetadata({ title, description, path, type = "website", absoluteTitle = false }: PageMetadataInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Economic Club Karachi",
      type,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}