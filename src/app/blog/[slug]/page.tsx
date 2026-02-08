import { getPostBySlug, getPosts } from "@/services/db";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  User,
  Tag,
  Home,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";

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

  return {
    title: `${post.title} | Asrul Nurrahim`,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || "",
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author?.full_name || "Asrul Nurrahim"],
      // images: [post.cover_image], // If we had a cover image field
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Format date
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unpublished";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Person",
      name: post.author?.full_name || "Asrul Nur Rahim",
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-30 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-gray-300 dark:text-gray-600" />
          <Link
            href="/blog"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Blog
          </Link>
          {post.categories && post.categories.length > 0 && (
            <>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-300 dark:text-gray-600" />
              <Link
                href={`/blog?category=${post.categories[0].slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {post.categories[0].name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4 mx-2 text-gray-300 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[200px] md:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {post.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    <Tag className="w-3 h-3 mr-1.5" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center">
            <div className="flex items-center text-gray-900 dark:text-gray-300 font-medium">
              <User className="w-4 h-4 mr-2" />
              {post.author?.full_name || "Admin"}
            </div>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="aspect-video w-full bg-gray-200 dark:bg-slate-900 rounded-2xl overflow-hidden mb-12 flex items-center justify-center relative shadow-sm">
          <span className="text-6xl opacity-20">🖼️</span>
        </div>

        {/* Article Content */}
        <article
          className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-li:text-gray-600 dark:prose-li:text-gray-300"
        >
          {/* If we had HTML content, we'd use dangerouslySetInnerHTML here. 
              Since the type definition has `content: string | null`, and it might be markdown or HTML.
              Assuming it's HTML for now or plain text. If markdown, we'd need a parser.
              Let's assume it's HTML from a WYSIWYG editor for simplicity or raw string. 
              If raw string, we might just display it. 
              But usually `content` implies the body. 
          */}
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          ) : (
            <p className="text-center italic text-gray-500">
              No content available for this post.
            </p>
          )}
        </article>

        {/* Author Section */}
        {post.author && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="shrink-0">
                {post.author.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name || "Author"}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 dark:border-gray-800"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-gray-50 dark:border-gray-800">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  About the Author
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.author.full_name || "Admin"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {post.author.bio ||
                    post.author.headline ||
                    "Passionate writer and developer sharing knowledge about technology and coding."}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
