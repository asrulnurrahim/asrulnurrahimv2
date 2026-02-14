import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getProfileByUsername } from "@/features/profile/services";
import { getPostsByAuthor } from "@/features/blog/services";
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
    <div className="min-h-screen bg-white pt-20 pb-16 dark:bg-gray-900">
      {/* Author Header */}
      <div className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
            <div className="relative shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-32 sm:w-32 dark:border-gray-800">
                <Image
                  src={profile.avatar_url || "/images/avatar-placeholder.png"}
                  alt={profile.full_name || "Author"}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
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
                <p className="max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base dark:text-gray-400">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Articles by {profile.full_name?.split(" ")[0]}
          </h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {meta.total} Posts
          </span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-0 dark:border-gray-800"
            >
              <div className="min-w-0 flex-1">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h3 className="group-hover:text-primary truncate text-lg font-medium text-gray-900 transition-colors dark:text-gray-100">
                    {post.title}
                  </h3>
                </Link>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
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
              <ArrowRight className="group-hover:text-primary -ml-4 h-5 w-5 text-gray-300 opacity-0 transition-colors group-hover:ml-0 group-hover:opacity-100 dark:text-gray-600" />
            </article>
          ))}

          {posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <p className="text-gray-500 dark:text-gray-400">
                Has not published any articles yet.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Link
              href={`/author/${username}?page=${currentPage - 1}`}
              className={`rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-700 ${
                currentPage > 1
                  ? "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  : "pointer-events-none cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-900"
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
              className={`rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium dark:border-gray-700 ${
                currentPage < meta.last_page
                  ? "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  : "pointer-events-none cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-900"
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
