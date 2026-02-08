import {
  getPostBySlug,
  getPosts,
  getRelatedPosts,
  getRecentPosts,
} from "@/services/db";
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
  Clock,
} from "lucide-react";
import ViewCounter from "@/components/blog/ViewCounter";
import { processContent } from "@/lib/toc";
import { calculateReadingTime } from "@/lib/utils";
import TableOfContents from "@/components/blog/TableOfContents";
import ArticleContent from "@/components/blog/ArticleContent";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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
      images: [
        {
          url: post.thumbnail || "/images/og-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || "",
      images: [post.thumbnail || "/images/og-default.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
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
      : [
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/images/og-default.jpg`,
        ],
    author: {
      "@type": "Person",
      name: post.author?.full_name || "Asrul Nur Rahim",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "Asrul Nur Rahim",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/favicon-96x96.png`,
      },
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`,
    },
  };

  const { content, toc } = processContent(post.content || "");
  const hasToc = toc.length >= 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-30 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-7xl">
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
        <header className="mb-10 text-center max-w-4xl mx-auto">
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
                    <Clock className="w-4 h-4 mr-1.5" />
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

        {/* Featured Image */}
        {post.thumbnail ? (
          <div className="aspect-video w-full bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden mb-12 relative shadow-sm max-w-5xl mx-auto">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gray-200 dark:bg-slate-900 rounded-2xl overflow-hidden mb-12 flex items-center justify-center relative shadow-sm max-w-5xl mx-auto">
            <span className="text-6xl opacity-20">🖼️</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative">
          {/* Table of Contents - Sidebar */}
          {hasToc && (
            <aside className="lg:col-span-3 order-1 lg:order-2">
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
              className={`
              prose prose-lg dark:prose-invert max-w-none 
              
              /* Layout & Spacing */
              scroll-mt-20

              /* --- TYPOGRAPHY SYSTEM --- */
              
              /* Headings */
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:leading-snug
              [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:leading-snug
              [&_h4]:text-lg md:[&_h4]:text-xl  [&_h4]:font-semibold [&_h4]:mt-8  [&_h4]:mb-3
              
              /* Paragraphs - The 'Medium' Look */
              [&_p]:text-base md:[&_p]:text-[18px] 
              [&_p]:leading-[1.75rem] md:[&_p]:leading-[2.25rem] 
              [&_p]:font-normal             
              [&_p]:text-gray-700 dark:[&_p]:text-gray-300
              [&_p]:mb-8
              
              /* Links */
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              
              /* Strong/Bold */
              prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
              
              /* Lists */
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_ul]:text-gray-700 dark:[&_ul]:text-gray-300
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8 [&_ol]:text-gray-700 dark:[&_ol]:text-gray-300
              [&_li]:pl-2 [&_li]:mb-2 [&_li]:leading-relaxed md:[&_li]:text-[18px]
              
              /* Blockquotes */
              [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 
              [&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:my-10
              [&_blockquote]:italic [&_blockquote]:text-xl [&_blockquote]:font-serif
              [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-400
              [&_blockquote]:bg-gray-50 dark:[&_blockquote]:bg-transparent
              
              /* Code Blocks */
              [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-6 [&_pre]:rounded-2xl 
              [&_pre]:overflow-x-auto [&_pre]:my-10 [&_pre]:text-sm [&_pre]:shadow-lg
              [&_pre]:relative /* Ensure copy button positioning */
              [&_code]:font-mono
              
              /* Inline Code (not inside pre) */
               [&_:not(pre)>code]:bg-gray-100 dark:[&_:not(pre)>code]:bg-gray-800 
               [&_:not(pre)>code]:text-pink-600 dark:[&_:not(pre)>code]:text-pink-400 
               [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 
               [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-medium
               
              /* Images */
              [&_img]:rounded-xl [&_img]:w-full [&_img]:h-auto [&_img]:my-10 [&_img]:shadow-md
            `}
            >
              {content ? (
                <ArticleContent content={content} />
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

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {isRelated ? "Artikel Terkait" : "Artikel Terbaru"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        {relatedPost.thumbnail ? (
                          <img
                            src={relatedPost.thumbnail}
                            alt={relatedPost.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <Tag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                          {relatedPost.categories?.[0]?.name || "Blog"}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                          {relatedPost.title}
                        </h4>
                        <time className="text-xs text-gray-500 dark:text-gray-400 block">
                          {format(
                            new Date(
                              relatedPost.published_at ||
                                relatedPost.created_at,
                            ),
                            "d MMMM yyyy",
                            { locale: id },
                          )}
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
