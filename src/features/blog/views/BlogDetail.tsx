import {
  getPostBySlug,
  getRelatedPosts,
  getRecentPosts,
} from "@/features/blog/services";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { notFound } from "next/navigation";
import {
  Calendar,
  User,
  Tag,
  Home,
  ChevronRight,
  Github,
  Linkedin,
  Instagram,
  Clock,
} from "lucide-react";
import {
  ArticleContent,
  ShareButtons,
  TableOfContents,
  ViewCounter,
} from "../components";
import { processContent } from "@/lib/toc";
import { highlightContent } from "@/lib/highlight";
import { calculateReadingTime, slugify } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export interface BlogDetailProps {
  slug: string;
}

export default async function BlogDetail({ slug }: BlogDetailProps) {
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch Related Posts
  const categoryIds = post.categories?.map((c) => c.id) || [];
  let relatedPosts = await getRelatedPosts(post.id, categoryIds);
  let isRelated = true;

  // Fallback to recent posts if no related posts found
  if (relatedPosts.length === 0) {
    const recent = await getRecentPosts(4); // Fetch 4 to be safe
    relatedPosts = recent.filter((p) => p.id !== post.id).slice(0, 3);
    isRelated = false;
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
    image: post.thumbnail
      ? [post.thumbnail]
      : [`${siteConfig.url}${siteConfig.ogImage}`],
    author: {
      "@type": "Person",
      name: post.author?.full_name || siteConfig.author,
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/favicon-96x96.png`,
      },
    },
    url: `${siteConfig.url}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };

  const { content: processedHtml, toc } = processContent(post.content || "");
  const content = await highlightContent(processedHtml);
  const hasToc = toc.length >= 3;

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-16 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center overflow-x-auto text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
          <Link
            href="/"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
          <Link
            href="/blog"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Blog
          </Link>
          {post.categories && post.categories.length > 0 && (
            <>
              <ChevronRight className="mx-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
              <Link
                href={`/blog/category/${post.categories[0].slug}`}
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                {post.categories[0].name}
              </Link>
            </>
          )}
          <ChevronRight className="mx-2 h-4 w-4 text-gray-300 dark:text-gray-600" />
          <span className="max-w-[200px] truncate font-medium text-gray-900 md:max-w-md dark:text-gray-200">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mx-auto mb-10 max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                    style={
                      cat.color
                        ? {
                            backgroundColor: `${cat.color}20`,
                            color: cat.color,
                          }
                        : {}
                    }
                  >
                    <Tag className="mr-1.5 h-3 w-3" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <span className="flex items-center">
              <Calendar className="mr-1.5 h-4 w-4" />
              {formattedDate}
            </span>
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            {(() => {
              const { readingTime, wordCount } = calculateReadingTime(
                post.content || "",
              );
              return (
                <>
                  <span
                    className="flex items-center"
                    title={`${wordCount.toLocaleString("id-ID")} kata`}
                  >
                    <Clock className="mr-1.5 h-4 w-4" />
                    {readingTime} menit baca
                  </span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">
                    •
                  </span>
                </>
              );
            })()}
            <ViewCounter
              slug={post.slug}
              initialViews={post.views || 0}
              trackView={true}
            />
          </div>

          <h1 className="mb-6 text-3xl leading-tight font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
            {post.title}
          </h1>

          <div className="flex items-center justify-center">
            <div className="flex items-center font-medium text-gray-900 dark:text-gray-300">
              <User className="mr-2 h-4 w-4" />
              {post.author?.full_name || "Admin"}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.thumbnail ? (
          <div className="relative mx-auto mb-12 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-100 shadow-sm dark:bg-slate-900">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative mx-auto mb-12 flex aspect-video w-full max-w-5xl items-center justify-center overflow-hidden rounded-2xl bg-gray-200 shadow-sm dark:bg-slate-900">
            <span className="text-6xl opacity-20">🖼️</span>
          </div>
        )}

        <div className="relative grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-12">
          {/* Table of Contents - Sidebar */}
          {hasToc && (
            <aside className="order-1 lg:order-2 lg:col-span-3">
              <TableOfContents headings={toc} />
            </aside>
          )}

          {/* Main Content Column */}
          <div
            className={`order-2 lg:order-1 ${
              hasToc ? "lg:col-span-9" : "lg:col-span-8 lg:col-start-3"
            }`}
          >
            <article
              className={`prose prose-lg dark:prose-invert /* Layout & Spacing */ /* --- TYPOGRAPHY SYSTEM --- */ /* Headings */ prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white /* Paragraphs - The 'Medium' Look */ /* Links */ prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline /* Strong/Bold */ prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white /* Lists */ /* Blockquotes */ /* Code Blocks */ /* Ensure copy button positioning */ /* Inline Code (not inside pre) */ /* Images */ max-w-none scroll-mt-20 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-gray-100 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-medium [&_:not(pre)>code]:text-pink-600 dark:[&_:not(pre)>code]:bg-gray-800 dark:[&_:not(pre)>code]:text-pink-400 [&_blockquote]:my-10 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-gray-50 [&_blockquote]:py-1 [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-xl [&_blockquote]:text-gray-600 [&_blockquote]:italic dark:[&_blockquote]:bg-transparent dark:[&_blockquote]:text-gray-400 [&_code]:font-mono [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:font-bold md:[&_h2]:text-3xl [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-xl [&_h3]:leading-snug [&_h3]:font-semibold md:[&_h3]:text-2xl [&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-lg [&_h4]:font-semibold md:[&_h4]:text-xl [&_img]:my-10 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-xl [&_img]:shadow-md [&_li]:mb-2 [&_li]:pl-2 [&_li]:leading-relaxed md:[&_li]:text-[18px] [&_ol]:mb-8 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-gray-700 dark:[&_ol]:text-gray-300 [&_p]:mb-8 [&_p]:text-base [&_p]:leading-7 [&_p]:font-normal [&_p]:text-gray-700 md:[&_p]:text-[18px] md:[&_p]:leading-9 dark:[&_p]:text-gray-300 [&_pre]:relative [&_pre]:my-10 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-gray-900 [&_pre]:p-6 [&_pre]:text-sm [&_pre]:text-gray-100 [&_pre]:shadow-lg [&_ul]:mb-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-700 dark:[&_ul]:text-gray-300`}
            >
              {content ? (
                <ArticleContent content={content} />
              ) : (
                <p className="text-center text-gray-500 italic">
                  No content available for this post.
                </p>
              )}
            </article>

            {/* Share Buttons */}
            <div className="my-10 border-t border-b border-gray-100 py-6 dark:border-gray-800">
              <ShareButtons
                title={post.title}
                url={`${siteConfig.url}/blog/${post.slug}`}
              />
            </div>

            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                  >
                    <span className="mr-1">#</span>
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Section */}
            {post.author && (
              <div className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800">
                <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm sm:flex-row sm:items-start dark:border-gray-800 dark:bg-slate-900">
                  <Link
                    href={`/author/${slugify(post.author.full_name || "admin")}`}
                    className="group shrink-0"
                  >
                    {post.author.avatar_url ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-gray-50 dark:border-gray-800">
                        <Image
                          src={post.author.avatar_url}
                          alt={post.author.full_name || "Author"}
                          fill
                          className="object-cover transition-colors group-hover:border-blue-100 dark:group-hover:border-blue-900/50"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-50 bg-blue-100 transition-colors group-hover:border-blue-100 dark:border-gray-800 dark:bg-blue-900/30 dark:group-hover:border-blue-900/50">
                        <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-2 text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                      About the Author
                    </div>
                    <Link
                      href={`/author/${slugify(post.author.full_name || "admin")}`}
                      className="decoration-blue-500/30 underline-offset-4 transition-all hover:underline"
                    >
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        {post.author.full_name || "Admin"}
                      </h3>
                    </Link>
                    <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-400">
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
                        className="text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 transition-colors hover:text-black dark:hover:text-white"
                        aria-label="X (Twitter)"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 transition-colors hover:text-pink-600 dark:hover:text-pink-400"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 border-t border-gray-200 pt-10 dark:border-gray-800">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  {isRelated ? "Artikel Terkait" : "Artikel Terbaru"}
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block"
                    >
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {relatedPost.thumbnail ? (
                          <Image
                            src={relatedPost.thumbnail}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Tag className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div
                          className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400"
                          style={
                            relatedPost.categories?.[0]?.color
                              ? { color: relatedPost.categories[0].color }
                              : {}
                          }
                        >
                          {relatedPost.categories?.[0]?.name || "Blog"}
                        </div>
                        <h4 className="line-clamp-2 text-sm leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {relatedPost.title}
                        </h4>
                        <time className="block text-xs text-gray-500 dark:text-gray-400">
                          {(() => {
                            const dateStr =
                              relatedPost.published_at ||
                              relatedPost.created_at ||
                              new Date().toISOString();
                            try {
                              return format(new Date(dateStr), "d MMMM yyyy", {
                                locale: id,
                              });
                            } catch {
                              return "Invalid Date";
                            }
                          })()}
                        </time>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
