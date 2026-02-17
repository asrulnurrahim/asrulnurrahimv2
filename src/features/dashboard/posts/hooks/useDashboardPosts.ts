import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Post, DashboardPostsOptions } from "@/features/blog/types";

interface DashboardPostsResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    last_page: number;
  };
}

const fetchDashboardPosts = async (
  options: DashboardPostsOptions,
): Promise<DashboardPostsResponse> => {
  const params = new URLSearchParams();
  if (options.page) params.set("page", options.page.toString());
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.query) params.set("query", options.query);
  if (options.sort) params.set("sort", options.sort);
  if (options.order) params.set("order", options.order);
  if (options.status) params.set("status", options.status);

  const res = await fetch(`/api/dashboard/posts?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard posts");
  }
  return res.json();
};

export const useDashboardPosts = (
  options: DashboardPostsOptions,
  initialData?: DashboardPostsResponse,
) => {
  return useQuery({
    queryKey: ["dashboard-posts", options],
    queryFn: () => fetchDashboardPosts(options),
    placeholderData: keepPreviousData,
    initialData: initialData,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/dashboard/posts?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete post");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};
