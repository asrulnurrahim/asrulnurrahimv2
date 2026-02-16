import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Post } from "@/features/blog/types";
import { useSearchParams } from "next/navigation";

interface PostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    last_page: number;
  };
}

interface UsePublicPostsOptions {
  categorySlug?: string;
  tagSlug?: string;
  initialData?: PostsResponse;
}

export const usePublicPosts = ({
  categorySlug,
  tagSlug,
  initialData,
}: UsePublicPostsOptions = {}) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  return useQuery({
    queryKey: ["public-posts", { page, search, categorySlug, tagSlug }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (search) params.set("search", search);
      if (categorySlug) params.set("category", categorySlug);
      if (tagSlug) params.set("tag", tagSlug);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<PostsResponse>;
    },
    placeholderData: keepPreviousData,
    initialData,
  });
};
