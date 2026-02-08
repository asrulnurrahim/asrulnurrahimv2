import Link from "next/link";
import { getPosts } from "@/services/db";
import { Calendar, ArrowRight } from "lucide-react";

export async function BlogSection() {
  const posts = await getPosts();
  const recentPosts = posts.slice(0, 3);

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  // Simple date formatter
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Draft";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Latest Insights
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Thoughts on software engineering, architecture, and design patterns.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-800">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-slate-700 text-gray-300 dark:text-gray-600">
                    <span className="text-4xl opacity-50">🖼️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Meta: Category & Date */}
                <div className="mb-4 flex items-center justify-between text-xs">
                  {post.category && (
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {post.category.name}
                    </span>
                  )}
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    {formatDate(post.published_at)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mb-6 flex-1 text-gray-600 dark:text-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750 transition-colors"
          >
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
