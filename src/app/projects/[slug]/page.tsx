import { getProjectBySlug, getProjects } from "@/features/projects/services";
import { ProjectDetail } from "@/features/projects/views";
import { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.seo_description || project.summary,
    openGraph: {
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary || "",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects/${project.slug}`,
      images: [
        {
          url: "/images/og-project-default.jpg", // Update if project has image
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary || "",
      images: ["/images/og-project-default.jpg"],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
