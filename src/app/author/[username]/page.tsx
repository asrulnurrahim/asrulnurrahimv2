import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getProfileByUsername, getPostsByAuthor } from "@/services/db";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: `${profile.full_name} - Author`,
    description: profile.bio || `Articles written by ${profile.full_name}`,
    openGraph: {
      title: `${profile.full_name} - Author at Asrul Nur Rahim Blog`,
      description: profile.bio || `Articles written by ${profile.full_name}`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: Props & { searchParams: Promise<{ page?: string }> }) {
  const { username } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const { data: posts, meta } = await getPostsByAuthor(profile.id, currentPage);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-16 pt-20">
      {/* Author Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <Image
                  src={profile.avatar_url || "/images/avatar-placeholder.png"}
                  alt={profile.full_name || "Author"}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.full_name}
                </h1>
                {/* <p className="text-lg text-primary font-medium mt-1">
                  {profile.role || "Author"}
                </p> */}
              </div>
              {profile.headline && (
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {profile.headline}
                </p>
              )}
              {profile.bio && (
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Articles by {profile.full_name?.split(" ")[0]}
          </h2>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
            {meta.total} Posts
          </span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 group"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${post.slug}`} className="block group">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <time dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                  <span>•</span>
                  {post.categories?.[0] && (
                    <span className="text-primary font-medium">
                      {post.categories[0].name}
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors -ml-4 opacity-0 group-hover:opacity-100 group-hover:ml-0" />
            </article>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                Has not published any articles yet.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Link
              href={`/author/${username}?page=${currentPage - 1}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 ${
                currentPage > 1
                  ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
              aria-disabled={currentPage <= 1}
            >
              Previous
            </Link>
            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {meta.last_page}
            </span>
            <Link
              href={`/author/${username}?page=${currentPage + 1}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 ${
                currentPage < meta.last_page
                  ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed pointer-events-none"
              }`}
              aria-disabled={currentPage >= meta.last_page}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
