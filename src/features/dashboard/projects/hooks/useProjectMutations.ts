import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProjectAction,
  updateProjectAction,
  softDeleteProjectAction,
  togglePublishAction,
  toggleFeaturedAction,
} from "../actions/projects";
import { ProjectFormValues } from "../schemas/project";
import { useRouter } from "next/navigation";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const res = await createProjectAction(data);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
      // Invalidate public projects too
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // toast.success("Project created successfully");
      console.log("Project created");
      router.push("/dashboard/projects");
      router.refresh();
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to create project");
      console.error(error.message || "Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProjectFormValues>;
    }) => {
      const res = await updateProjectAction(id, data);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data?.slug] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // toast.success("Project updated successfully");
      console.log("Project updated");
      router.refresh();
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to update project");
      console.error(error.message || "Failed to update project");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await softDeleteProjectAction(id);
      if (res.error) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // toast.success("Project deleted successfully");
      console.log("Project deleted");
      router.refresh();
    },
    onError: (error) => {
      // toast.error(error.message || "Failed to delete project");
      console.error(error.message || "Failed to delete project");
    },
  });
};

export const useTogglePublish = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await togglePublishAction(id);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data?.slug] });
      router.refresh();
    },
  });
};

export const useToggleFeatured = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await toggleFeaturedAction(id);
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data?.slug] });
      router.refresh();
    },
  });
};
