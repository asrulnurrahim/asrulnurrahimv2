import { BlogDetail } from "@/features/blog/views";
import { getPostBySlug, getPosts } from "@/features/blog/services";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

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

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || "";
  const publishedTime = post.published_at || undefined;
  const modifiedTime = post.updated_at || undefined;
  const authors = [post.author?.full_name || siteConfig.author];

  // Image handling with fallback
  const ogImage = post.thumbnail
    ? post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${siteConfig.url}${post.thumbnail}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: title,
    description: description,
    keywords: post.tags?.map((t) => t.name),
    authors: [{ name: authors[0], url: `${siteConfig.url}/about` }],
    openGraph: {
      title: title,
      description: description,
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
      siteName: `${siteConfig.author} Blog`,
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
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
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
