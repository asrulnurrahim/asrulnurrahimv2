import { env } from "@/lib/env/client";

export const siteConfig = {
  url: env.NEXT_PUBLIC_SITE_URL || "https://asrulnurrahim.com",
  title: "Asrul Tech - Front-End Engineer & UI Architect",
  siteName: "Asrul Tech",
  description:
    "Personal website of Asrul Nur Rahim. Specializing in pixel-perfect UI, performance optimization, and scalable front-end architecture.",
  author: "Asrul Nur Rahim",
  twitterHandle: "@asrulnurrahim",
  ogImage: "/asrul.jpg", // Default OG image
  links: {
    github: "https://github.com/asrulnurrahim",
    linkedin: "https://linkedin.com/in/asrulnurrahim",
    twitter: "https://twitter.com/asrulnurrahim",
    instagram: "https://instagram.com/asrulnurrahim",
    facebook: "https://facebook.com/asrulnurrahim",
    youtube: "https://youtube.com/@asrulnurrahim",
    tiktok: "https://tiktok.com/@asrulnurrahim",
  },
  contact: {
    email: "contact@asrulnurrahim.com",
  },
  keywords: [
    "Front-End Engineer",
    "UI Architect",
    "React Developer",
    "Next.js Expert",
    "TypeScript",
    "Tailwind CSS",
  ],
};
