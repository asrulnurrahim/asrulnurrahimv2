import { env } from "@/lib/env/client";

export const siteConfig = {
  url: env.NEXT_PUBLIC_SITE_URL,
  title: "Asrul Tech - Front-End Engineer & UI Architect",
  siteName: "Asrul Tech",
  description:
    "Personal website of Asrul Nur Rahim. Specializing in pixel-perfect UI, performance optimization, and scalable front-end architecture.",
  author: "Asrul Nur Rahim",
  twitterHandle: "@asrulnurrahim",
  ogImage: "/asrul.jpg", // Default OG image
  keywords: [
    "Front-End Engineer",
    "UI Architect",
    "React Developer",
    "Next.js Expert",
    "TypeScript",
    "Tailwind CSS",
  ],
};
