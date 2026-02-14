import { BlogDetail } from "@/features/blog/views";
import { getPostBySlug, getPosts } from "@/features/blog/services";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60; // Revalidate every minute

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || "";
  const publishedTime = post.published_at || undefined;
  const modifiedTime = post.updated_at || undefined;
  const authors = [post.author?.full_name || "Asrul Nur Rahim"];

  // Image handling with fallback
  const ogImage = post.thumbnail
    ? post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${siteUrl}${post.thumbnail}`
    : `${siteUrl}/images/og-default.jpg`;

  return {
    title: title,
    description: description,
    keywords: post.tags?.map((t) => t.name),
    authors: [{ name: authors[0], url: `${siteUrl}/about` }],
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: "Asrul Nur Rahim Blog",
      locale: "id_ID",
      publishedTime,
      modifiedTime,
      authors,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      site: "@asrulnurrahim",
      creator: "@asrulnurrahim",
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetail slug={slug} />;
}
