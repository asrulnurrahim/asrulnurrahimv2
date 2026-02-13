import {
  getPaginatedPosts,
  getCategories,
  getPopularPosts,
  getTagBySlug,
  getTags,
} from "@/services/db";
import Link from "next/link";
import { Eye, Tag as TagIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import SearchInput from "@/app/blog/components/SearchInput";
import Pagination from "@/components/ui/Pagination";

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
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/tag/${slug}${pageNum > 1 ? `?page=${pageNum}` : ""}`;

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
  const { search, page } = await searchParams;

  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const pageNum = Number(page) || 1;
  const limit = 10;

  const [postsRes, categories, popularPosts, tags] = await Promise.all([
    getPaginatedPosts(pageNum, limit, search, undefined, slug),
    getCategories(),
    getPopularPosts(5),
    getTags(),
  ]);

  const { data: posts, meta } = postsRes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-30 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <TagIcon className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {tag.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Posts tagged with <span className="font-semibold">#{tag.name}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content - Blog List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="relative group flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-800"
              >
                {/* Image Section */}
                <div className="w-full md:w-1/3 min-w-[280px] md:max-w-[320px] relative">
                  <div className="aspect-video md:h-full w-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-300 dark:text-gray-600 group-hover:scale-105 transition-transform duration-500">
                        <span className="text-5xl opacity-40">🖼️</span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {post.categories && post.categories.length > 0 ? (
                      post.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/blog/category/${cat.slug}`}
                          className="relative z-10 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Uncategorized
                      </span>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(post.published_at!).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {(post.views || 0).toLocaleString()}
                    </div>
                  </div>

                  <h2
                    className="text-xl md:text-2xl font-bold text-[#32424a] dark:text-white mb-3 hover:text-[#1e282d] dark:hover:text-blue-400 transition-colors line-clamp-2"
                    title={post.title}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed text-sm md:text-base">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      By {post.author?.full_name || "Admin"}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex -space-x-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="relative z-10 inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold text-white bg-blue-500 border-2 border-white rounded-full dark:border-gray-900"
                            title={tag.name}
                          >
                            #
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="relative z-10 inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold text-white bg-gray-400 border-2 border-white rounded-full dark:border-gray-900">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No posts found for tag{" "}
                  <span className="font-bold">#{tag.name}</span>.
                </p>
                <Link
                  href="/blog"
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Blog
                </Link>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={meta.page}
              totalPages={meta.last_page}
              baseUrl={`/blog/tag/${slug}`}
              searchParams={{ search }}
            />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Search Widget */}
            <SearchInput />

            {/* Popular Posts Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Popular Posts
              </h3>
              <div className="flex flex-col gap-4">
                {popularPosts.length > 0 ? (
                  popularPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group"
                    >
                      <h4 className="text-[#32424a] dark:text-gray-300 font-medium group-hover:text-[#1e282d] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Eye className="w-3 h-3 mr-1" />
                        {(post.views || 0).toLocaleString()} views
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No popular posts.</p>
                )}
              </div>
            </div>

            {/* Topics Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                >
                  <span className="font-medium mr-1.5">All</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-500 dark:bg-slate-900 dark:text-gray-400">
                    {categories.reduce(
                      (acc, cat) => acc + (cat.posts?.[0]?.count || 0),
                      0,
                    )}
                  </span>
                </Link>
                {categories.map((cat) => {
                  return (
                    <Link
                      key={cat.id}
                      href={`/blog/category/${cat.slug}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                    >
                      <span className="font-medium mr-1.5">{cat.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-500 dark:bg-slate-900 dark:text-gray-400">
                        {cat.posts?.[0]?.count || 0}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tags Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link
                    key={t.id}
                    href={`/blog/tag/${t.slug}`}
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs transition-colors ${
                      t.slug === slug
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="mr-1">#</span>
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
