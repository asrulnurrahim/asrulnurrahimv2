import { createStaticClient } from "@/lib/supabase/static";
import { Project } from "@/features/projects/types";

export const getProjects = async () => {
  const supabase = createStaticClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<Project[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return projects || [];
};

export const getFeaturedProjects = async (limit = 3) => {
  const supabase = createStaticClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Project[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return projects || [];
};

export const getProjectBySlug = async (slug: string) => {
  const supabase = createStaticClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single<Project>();

  if (error) return null;
  return project;
};
