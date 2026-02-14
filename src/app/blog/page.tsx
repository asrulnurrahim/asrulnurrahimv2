import { BlogList } from "@/features/blog/views";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const isFiltered = !!params.search; // Only indexed if search. Categories have their own pages now.
  const page = Number(params.page) || 1;

  let title = `Blog${page > 1 ? ` - Page ${page}` : ""}`;

  if (params.search) {
    title = `Search: "${params.search}" | Blog`;
  }

  const canonicalUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/blog${page > 1 ? `?page=${page}` : ""}`;

  return {
    title,
    description: "Insights, tutorials, and thoughts on software engineering.",
    robots: {
      index: !isFiltered,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: "Insights, tutorials, and thoughts on software engineering.",
      url: canonicalUrl,
      type: "website",
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  // Redirect legacy query param category to new route
  if (params.category) {
    redirect(`/blog/category/${params.category}`);
  }

  return <BlogList searchParams={searchParams} />;
}
