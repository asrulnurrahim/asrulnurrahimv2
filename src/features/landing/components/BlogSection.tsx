import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/features/blog/services";
import { Calendar, ArrowRight, Eye } from "lucide-react";

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
    <section className="bg-white py-20 md:py-28 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
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
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-slate-900"
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-800">
                {post.thumbnail ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="transform object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-300 dark:bg-slate-700 dark:text-gray-600">
                    <span className="text-4xl opacity-50">🖼️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {/* Meta: Category & Date */}
                <div className="mb-4 flex items-center justify-between text-xs">
                  {post.category && (
                    <Link
                      href={`/blog/category/${post.category.slug}`}
                      className="relative z-10 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                      style={
                        post.category.color
                          ? {
                              backgroundColor: `${post.category.color}20`,
                              color: post.category.color,
                            }
                          : {}
                      }
                    >
                      {post.category.name}
                    </Link>
                  )}
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      {(post.views || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-[#32424a] transition-colors group-hover:text-[#1e282d] dark:text-white dark:group-hover:text-blue-400"
                  title={post.title}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mb-6 line-clamp-3 flex-1 text-gray-600 dark:text-gray-400">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="mt-auto flex items-center text-sm font-semibold text-[#32424a] transition-all group-hover:translate-x-1 group-hover:text-[#1e282d] dark:text-blue-400 dark:group-hover:text-blue-300">
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
            className="dark:hover:bg-gray-750 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
