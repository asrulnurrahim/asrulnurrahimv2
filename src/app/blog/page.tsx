import { getPosts, getCategories, getRecentPosts } from "@/services/db";
import Link from "next/link";
import { Eye } from "lucide-react";

import SearchInput from "./components/SearchInput";

import { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const isFiltered = !!params.category || !!params.search;

  return {
    title: "Blog | Asrul Nur Rahim",
    description: "Insights, tutorials, and thoughts on software engineering.",
    robots: {
      index: !isFiltered,
      follow: true,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog`,
    },
    openGraph: {
      title: "Blog | Asrul Nur Rahim",
      description: "Insights, tutorials, and thoughts on software engineering.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog`,
      type: "website",
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;

  const [posts, categories, recentPosts] = await Promise.all([
    getPosts(search, category),
    getCategories(),
    getRecentPosts(5),
  ]);

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
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.published_at,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-30 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content - Blog List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-800"
              >
                {/* Image Section */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="w-full md:w-1/3 min-w-[280px] md:max-w-[320px] relative group"
                >
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
                  </div>
                </Link>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {post.categories && post.categories.length > 0 ? (
                      post.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/blog?category=${cat.slug}`}
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
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
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed text-sm md:text-base">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      By {post.author?.full_name || "Admin"}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No posts found.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Search Widget */}
            <SearchInput />

            {/* Recent Posts Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Posts
              </h3>
              <div className="flex flex-col gap-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group"
                  >
                    <h4 className="text-[#32424a] dark:text-gray-300 font-medium group-hover:text-[#1e282d] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(post.published_at!).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </Link>
                ))}
                {recentPosts.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent posts.</p>
                )}
              </div>
            </div>

            {/* Topics Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Topics
              </h3>
              <div className="flex flex-col gap-2">
                <Link
                  href="/blog"
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    !category
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <span className="font-medium">All Topics</span>
                </Link>
                {categories.map((cat) => {
                  const isActive = category === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors group ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        className={`font-medium transition-colors ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                      >
                        {cat.name}
                      </span>
                      <span
                        className={`text-sm ${
                          isActive
                            ? "text-blue-400 dark:text-blue-300"
                            : "text-gray-400"
                        }`}
                      >
                        {cat.posts?.[0]?.count || 0}
                      </span>
                    </Link>
                  );
                })}
                {categories.length === 0 && (
                  <p className="text-gray-500 text-sm">No topics found.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
