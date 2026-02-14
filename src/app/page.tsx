import { LandingPage } from "@/features/landing/views";
import { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Asrul Nur Rahim - Front-End Engineer & UI Architect",
  description:
    "Personal website of Asrul Nur Rahim. Specializing in pixel-perfect UI, performance optimization, and scalable front-end architecture.",
  openGraph: {
    type: "website",
    title: "Asrul Nur Rahim - Front-End Engineer",
    description:
      "Crafting high-performance web experiences with precision and passion.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Asrul Nur Rahim",
    images: ["/asrul.jpg"], // Using existing image
  },
};

export default function Home() {
  return <LandingPage />;
}
