import { getProjectBySlug, getProjects } from "@/features/projects/services";
import { ProjectDetail } from "@/features/projects/views";
import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

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
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    openGraph: {
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary || "",
      url: `${siteConfig.url}/projects/${project.slug}`,
      images: [
        {
          url: project.thumbnail
            ? project.thumbnail.startsWith("http")
              ? project.thumbnail
              : `${siteConfig.url}${project.thumbnail}`
            : siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.url}/projects/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.seo_title || project.title,
      description: project.seo_description || project.summary || "",
      images: [siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return <ProjectDetail slug={slug} />;
}
