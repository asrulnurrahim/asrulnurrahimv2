import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags } from "@/features/blog/services/tags";
import {
  createTag as createTagAction,
  updateTag as updateTagAction,
  deleteTag as deleteTagAction,
} from "@/features/blog/services/actions";

export const useTags = () => {
  const queryClient = useQueryClient();

  const {
    data: tags = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      return await getTags();
    },
  });

  const createTag = useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);

      // Pass null as prevState since it is a server action designed for useFormState but called directly here
      const res = await createTagAction(null, formData);
      if (res.message !== "Success") {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const updateTag = useMutation({
    mutationFn: async (data: { id: string; name: string; slug: string }) => {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("name", data.name);
      formData.append("slug", data.slug);

      const res = await updateTagAction(null, formData);
      if (res.message !== "Success") {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteTagAction(id);
      if (res.message !== "Success") {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  return {
    tags,
    isLoading,
    error,
    createTag: createTag.mutate,
    updateTag: updateTag.mutate,
    deleteTag: deleteTag.mutate,
    isCreating: createTag.isPending,
    isUpdating: updateTag.isPending,
    isDeleting: deleteTag.isPending,
  };
};
