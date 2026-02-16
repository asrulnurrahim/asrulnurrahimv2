import {
  getPaginatedPosts,
  getCategories,
  getPopularPosts,
  getTags,
  getTagBySlug,
} from "@/features/blog/services";
import { Category } from "@/features/blog/types";
import BlogListClient from "../components/BlogListClient";

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

  // Resolve active category if slug is provided
  const activeCategory = categorySlug
    ? categories.find((c: Category) => c.slug === categorySlug)
    : null;

  return (
    <BlogListClient
      initialPosts={postsRes}
      categories={categories}
      popularPosts={popularPosts}
      tags={tags}
      activeCategory={activeCategory || null}
      activeTag={activeTag || null}
      search={search}
      categorySlug={categorySlug}
      tagSlug={tagSlug}
    />
  );
}
