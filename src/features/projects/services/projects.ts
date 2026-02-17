import { createStaticClient } from "@/lib/supabase/static";
import { ProjectWithTechnologies } from "@/features/projects/types";

// Helper type for the raw Supabase response with joined technologies
type HelperProjectResponse = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  summary: string | null;
  problem: string | null;
  solution: string | null;
  architecture: string | null;
  result: string | null;
  learnings: string | null;
  status: "draft" | "published";
  live_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project_technologies: {
    technology: {
      id: string;
      name: string;
    } | null;
  }[];
};

export const getPublishedProjects = async () => {
  const supabase = createStaticClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_technologies (
        technology:technologies (
          id,
          name
        )
      )
    `,
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .returns<HelperProjectResponse[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);

  // Transform to match ProjectWithTechnologies
  return (projects || []).map((p) => ({
    ...p,
    technologies: p.project_technologies
      .map((pt) => pt.technology)
      .filter((t): t is { id: string; name: string } => t !== null),
  })) as ProjectWithTechnologies[];
};

export const getFeaturedProjects = async (limit = 3) => {
  const supabase = createStaticClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_technologies (
        technology:technologies (
          id,
          name
        )
      )
    `,
    )
    .eq("is_featured", true)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit)
    .returns<HelperProjectResponse[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);

  // Transform to match ProjectWithTechnologies
  return (projects || []).map((p) => ({
    ...p,
    technologies: p.project_technologies
      .map((pt) => pt.technology)
      .filter((t): t is { id: string; name: string } => t !== null),
  })) as ProjectWithTechnologies[];
};

export const getProjectBySlug = async (slug: string) => {
  const supabase = createStaticClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_technologies (
        technology:technologies (
          id,
          name
        )
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single<HelperProjectResponse>();

  if (error || !project) return null;

  // Transform to match ProjectWithTechnologies
  return {
    ...project,
    technologies: project.project_technologies
      .map((pt) => pt.technology)
      .filter((t): t is { id: string; name: string } => t !== null),
  } as ProjectWithTechnologies;
};
