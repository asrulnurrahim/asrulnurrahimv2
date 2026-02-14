import { BlogList } from "@/features/blog/views";
import { getCategoryBySlug } from "@/features/blog/services";
import { Metadata } from "next";

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
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const pageNum = Number(page) || 1;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/category/${slug}${pageNum > 1 ? `?page=${pageNum}` : ""}`;

  return {
    title: `${category.name}${pageNum > 1 ? ` - Page ${pageNum}` : ""} | Blog`,
    description:
      category.description ||
      `Posts in category ${category.name}. Insights, tutorials, and thoughts on software engineering.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | Blog`,
      description: category.description || `Posts in category ${category.name}`,
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;

  return <BlogList searchParams={searchParams} categorySlug={slug} />;
}
