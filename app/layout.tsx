import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerEnvironment } from "@/lib/env";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const editorial = Playfair_Display({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });
const siteUrl = getServerEnvironment().NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Economic Club Karachi",
    template: "%s | Economic Club Karachi",
  },
  description:
    "Learn about Economic Club Karachi, described on its public profile as a growing welfare organization, and ask about its current work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${editorial.variable} flex min-h-screen flex-col`}
        suppressHydrationWarning
      >
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
