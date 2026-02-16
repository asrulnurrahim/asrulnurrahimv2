import { ProjectList } from "@/features/projects/views";
import { Metadata } from "next";

export const revalidate = 60;

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projects",
  description: "Showcase of my recent projects, applications, and experiments.",
  keywords: ["Projects", "Portfolio", "Case Studies", ...siteConfig.keywords],
  openGraph: {
    title: "Projects | Asrul Tech",
    description:
      "Showcase of my recent projects, applications, and experiments.",
    url: `${siteConfig.url}/projects`,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Projects",
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.url}/projects`,
  },
};

export default function ProjectsPage() {
  return <ProjectList />;
}
