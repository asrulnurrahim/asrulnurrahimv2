import {
  getPaginatedPosts,
  getCategories,
  getPopularPosts,
  getTags,
  getTagBySlug,
} from "@/features/blog/services";
import Link from "next/link";
import Image from "next/image";
import { Eye, Folder, Search, Tag as TagIcon } from "lucide-react";

import { SearchInput } from "../components";
import Pagination from "@/components/ui/Pagination";
import { Post, Category, Tag } from "../types";

export interface BlogListProps {
  searchParams: Promise<{ search?: string; page?: string }>;
  categorySlug?: string;
  tagSlug?: string;
}

export default async function BlogList({
  searchParams,
  categorySlug,
  tagSlug,
}: BlogListProps) {
  const params = await searchParams;
  const search = params.search;
  const page = Number(params.page) || 1;
  const limit = 10;

  // Parallel data fetching
  const postsPromise = getPaginatedPosts(
    page,
    limit,
    search,
    categorySlug,
    tagSlug,
  );
  const categoriesPromise = getCategories();
  const popularPostsPromise = getPopularPosts(5);
  const tagsPromise = getTags();
  const activeTagPromise = tagSlug
    ? getTagBySlug(tagSlug)
    : Promise.resolve(null);

  const [postsRes, categories, popularPosts, tags, activeTag] =
    await Promise.all([
      postsPromise,
      categoriesPromise,
      popularPostsPromise,
      tagsPromise,
      activeTagPromise,
    ]);

  const { data: posts, meta } = postsRes;

  // Resolve active category if slug is provided
  const activeCategory = categorySlug
    ? categories.find((c: Category) => c.slug === categorySlug)
    : null;

  // Determine page title and header content
  let pageTitle = "Blog";
  const pageDescription =
    "Insights, tutorials, and thoughts on software engineering.";
  let HeaderIcon = null;
  let headerColorClass = "";
  let headerStyle = {};

  if (activeCategory) {
    pageTitle = activeCategory.name;
    HeaderIcon = Folder;
    headerColorClass =
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (activeCategory.color) {
      headerStyle = {
        backgroundColor: `${activeCategory.color}20`,
        color: activeCategory.color,
      };
    }
  } else if (activeTag) {
    pageTitle = activeTag.name;
    HeaderIcon = TagIcon;
    headerColorClass =
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  } else if (search) {
    pageTitle = "Search Results";
    HeaderIcon = Search;
    headerColorClass =
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Asrul Nur Rahim Blog",
    description: "Insights, tutorials, and thoughts on software engineering.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog`,
    author: {
      "@type": "Person",
      name: "Asrul Nur Rahim",
    },
    blogPost: posts.map((post: Post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.published_at,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`,
    })),
  };

  // Construct base URL for pagination
  let baseUrl = "/blog";
  if (categorySlug) baseUrl = `/blog/category/${categorySlug}`;
  else if (tagSlug) baseUrl = `/blog/tag/${tagSlug}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-16 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          {HeaderIcon && (
            <div
              className={`mb-4 inline-flex items-center justify-center rounded-full p-3 ${headerColorClass}`}
              style={headerStyle}
            >
              <HeaderIcon className="h-6 w-6" />
            </div>
          )}
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            {activeCategory ? (
              <>
                Posts in category{" "}
                <span className="font-semibold">{activeCategory.name}</span>
              </>
            ) : activeTag ? (
              <>
                Posts tagged with{" "}
                <span className="font-semibold">#{activeTag.name}</span>
              </>
            ) : search ? (
              <>
                Search results for{" "}
                <span className="font-semibold text-pretty italic">
                  &quot;{search}&quot;
                </span>
              </>
            ) : (
              pageDescription
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Content - Blog List */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {posts.map((post: Post) => (
              <article
                key={post.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md md:flex-row dark:border-gray-800 dark:bg-slate-900"
              >
                {/* Image Section */}
                <div className="relative w-full min-w-[280px] md:w-1/3 md:max-w-[320px]">
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100 md:h-full dark:bg-gray-800">
                    {post.thumbnail ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-300 transition-transform duration-500 group-hover:scale-105 dark:bg-gray-800 dark:text-gray-600">
                        <span className="text-5xl opacity-40">🖼️</span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {post.categories && post.categories.length > 0 ? (
                      post.categories.map((cat: Category) => (
                        <Link
                          key={cat.id}
                          href={`/blog/category/${cat.slug}`}
                          className="relative z-10 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                          style={
                            cat.color
                              ? {
                                  backgroundColor: `${cat.color}20`,
                                  color: cat.color,
                                }
                              : {}
                          }
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        Uncategorized
                      </span>
                    )}
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {new Date(post.published_at!).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      {(post.views || 0).toLocaleString()}
                    </div>
                  </div>

                  <h2
                    className="mb-3 line-clamp-2 text-xl font-bold text-[#32424a] transition-colors hover:text-[#1e282d] md:text-2xl dark:text-white dark:hover:text-blue-400"
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

                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 md:text-base dark:text-gray-400">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      By {post.author?.full_name || "Admin"}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex -space-x-2">
                        {post.tags.slice(0, 3).map((tag: Tag) => (
                          <span
                            key={tag.id}
                            className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-[10px] font-bold text-white dark:border-gray-900"
                            title={tag.name}
                          >
                            #
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-400 text-[10px] font-bold text-white dark:border-gray-900">
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
              <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center dark:border-gray-800 dark:bg-slate-900">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  No posts found.
                </p>
                {(activeCategory || activeTag || search) && (
                  <Link
                    href="/blog"
                    className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Back to Blog
                  </Link>
                )}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={meta.page}
              totalPages={meta.last_page}
              baseUrl={baseUrl}
              searchParams={{ search }}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Search Widget */}
            <SearchInput />

            {/* Popular Posts Widget */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Popular Posts
              </h3>
              <div className="flex flex-col gap-4">
                {popularPosts.length > 0 ? (
                  popularPosts.map((post: Post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group"
                    >
                      <h4 className="line-clamp-2 font-medium text-[#32424a] transition-colors group-hover:text-[#1e282d] dark:text-gray-300 dark:group-hover:text-blue-400">
                        {post.title}
                      </h4>
                      <div className="mt-1 flex items-center text-xs text-gray-400">
                        <Eye className="mr-1 h-3 w-3" />
                        {(post.views || 0).toLocaleString()} views
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No popular posts.</p>
                )}
              </div>
            </div>

            {/* Topics Widget */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    !activeCategory && !activeTag
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="mr-1.5 font-medium">All</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      !activeCategory && !activeTag
                        ? "bg-gray-700 text-gray-200 dark:bg-gray-200 dark:text-gray-700"
                        : "bg-gray-200 text-gray-500 dark:bg-slate-900 dark:text-gray-400"
                    }`}
                  >
                    {categories.reduce(
                      (acc: number, cat: Category) =>
                        acc + (cat.posts?.[0]?.count || 0),
                      0,
                    )}
                  </span>
                </Link>
                {categories.map((cat: Category) => {
                  const isActive = categorySlug === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/blog/category/${cat.slug}`}
                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                      }`}
                      style={
                        isActive && cat.color
                          ? {
                              backgroundColor: cat.color,
                              color: "#fff",
                              boxShadow: `0 4px 6px -1px ${cat.color}30`,
                            }
                          : {}
                      }
                    >
                      <span className="mr-1.5 font-medium">{cat.name}</span>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs ${
                          isActive
                            ? "bg-blue-500 text-blue-50"
                            : "bg-gray-200 text-gray-500 dark:bg-slate-900 dark:text-gray-400"
                        }`}
                      >
                        {cat.posts?.[0]?.count || 0}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tags Widget */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: Tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className={`inline-flex items-center rounded-lg px-3 py-1 text-xs transition-colors ${
                      tagSlug === tag.slug
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="mr-1">#</span>
                    {tag.name}
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
