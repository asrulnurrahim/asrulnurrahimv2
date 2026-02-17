import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPostAction,
  updatePostAction,
} from "@/features/blog/services/actions";
import { Post } from "@/features/blog/types";
import { useRouter } from "next/navigation";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      post,
      categoryIds,
      tagIds,
    }: {
      post: Partial<Post>;
      categoryIds?: string[];
      tagIds?: string[];
    }) => {
      const { data, error } = await createPostAction(post, categoryIds, tagIds);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      // Invalidate public posts as well just in case
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.refresh();
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      post,
      categoryIds,
      tagIds,
    }: {
      id: string;
      post: Partial<Post>;
      categoryIds?: string[];
      tagIds?: string[];
    }) => {
      const { data, error } = await updatePostAction(
        id,
        post,
        categoryIds,
        tagIds,
      );
      if (error) throw new Error(error);
      if (!data) throw new Error("No data returned");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-posts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.refresh();
    },
  });
};
