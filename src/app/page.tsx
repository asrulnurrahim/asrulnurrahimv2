import { LandingPage } from "@/features/landing/views";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.author,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.author,
      },
    ],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function Home() {
  return <LandingPage />;
}
