import { ProjectList } from "@/features/projects/views";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description: "Showcase of my recent projects, applications, and experiments.",
  openGraph: {
    title: "Projects",
    description:
      "Showcase of my recent projects, applications, and experiments.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects`,
    type: "website",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects`,
  },
};

export default function ProjectsPage() {
  return <ProjectList />;
}
