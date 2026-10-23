import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerEnvironment } from "@/lib/env";
import "./globals.css";

const siteUrl = getServerEnvironment().NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Economic Club Karachi",
    template: "%s | Economic Club Karachi",
  },
  description:
    "Economic Club Karachi connects people, ideas, and opportunity through business, community, and economic dialogue.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a
          className="sr-only z-50 rounded bg-white p-3 text-brand-purple focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          href="#main-content"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
