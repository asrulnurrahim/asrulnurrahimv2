import { BlogList } from "@/features/blog/views";
import { getTagBySlug } from "@/features/blog/services";
import { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const revalidate = 60; // Revalidate every minute

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const pageNum = Number(page) || 1;
  const canonicalUrl = `${siteConfig.url}/blog/tag/${slug}${pageNum > 1 ? `?page=${pageNum}` : ""}`;

  return {
    title: `${tag.name} - Tag${pageNum > 1 ? ` - Page ${pageNum}` : ""} | Blog`,
    description: `Posts tagged with ${tag.name}. Insights, tutorials, and thoughts on software engineering.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${tag.name} - Tag | Blog`,
      description: `Posts tagged with ${tag.name}`,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;

  return <BlogList searchParams={searchParams} tagSlug={slug} />;
}
