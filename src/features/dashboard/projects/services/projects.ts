import "server-only";
import {
  ProjectFormValues,
  projectDbSchema,
} from "@/features/dashboard/projects/schemas/project";
import { createClient } from "@/lib/supabase/server";
import { ProjectWithTechnologies, Technology } from "@/features/projects/types";

/**
 * Fetch all available technologies for use in form selection.
 * Sorted by name ascending.
 */
export const getAllTechnologies = async (): Promise<Technology[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("technologies")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching technologies:", error);
    return [];
  }

  return data || [];
};

/**
 * Resolves a mix of UUIDs and technology names into an array of strictly UUIDs.
 * It bulk-queries existing names and bulk-inserts new names to avoid N+1 queries.
 */
const resolveTechnologies = async (
  technologies: string[],
): Promise<string[]> => {
  if (!technologies || technologies.length === 0) return [];
  const supabase = await createClient();

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  const existingIds = technologies.filter((t) => uuidRegex.test(t));
  const newNames = technologies.filter((t) => !uuidRegex.test(t));

  if (newNames.length === 0) {
    return existingIds;
  }

  // Find existing technologies by name in one query
  const { data: existingTechs } = await supabase
    .from("technologies")
    .select("id, name")
    .in("name", newNames);

  const foundNames = existingTechs?.map((t) => t.name) || [];
  const foundIds = existingTechs?.map((t) => t.id) || [];

  const namesToCreate = newNames.filter((name) => !foundNames.includes(name));

  let createdIds: string[] = [];
  if (namesToCreate.length > 0) {
    // Bulk insert new technologies
    const { data: newTechs, error } = await supabase
      .from("technologies")
      .insert(namesToCreate.map((name) => ({ name })))
      .select("id");

    if (error)
      throw new Error(`Failed to create technologies: ${error.message}`);
    createdIds = newTechs?.map((t) => t.id) || [];
  }

  return [...existingIds, ...foundIds, ...createdIds];
};

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
  project_technologies:
    | {
        technology: {
          id: string;
          name: string;
        } | null;
      }[]
    | null;
};

// Admin: Get all projects (draft & published)
export const getAdminProjects = async () => {
  const supabase = await createClient();
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
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin projects:", error);
    return [];
  }

  // Transform to match ProjectWithTechnologies interface
  return (projects as unknown as HelperProjectResponse[]).map((project) => ({
    ...project,
    technologies:
      project.project_technologies
        ?.map((pt) => pt.technology)
        .filter((t): t is { id: string; name: string } => t !== null) || [],
    // Remove the raw relation property to keep it clean
    project_technologies: undefined,
  }));
};

// Admin: Get single project by ID (draft & published)
export const getAdminProjectById = async (id: string) => {
  const supabase = await createClient();
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
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !project) {
    console.error("Error fetching admin project by ID:", error);
    return null;
  }

  // Transform to match ProjectWithTechnologies interface
  const helper = project as unknown as HelperProjectResponse;
  const transformed: ProjectWithTechnologies = {
    ...helper,
    technologies:
      helper.project_technologies
        ?.map((pt) => pt.technology)
        .filter((t): t is { id: string; name: string } => t !== null) || [],
  };

  return transformed;
};

// Admin: Create Project
export const createProjectService = async (data: ProjectFormValues) => {
  const supabase = await createClient();
  // 1. Validate and construct database payload safely
  const projectData = projectDbSchema.parse(data);
  const { technologies } = data;

  // 2. Insert Project
  const { data: project, error } = await supabase
    .from("projects")
    .insert([
      {
        ...projectData,
        published_at:
          projectData.status === "published" ? new Date().toISOString() : null,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Handle Technologies (Many-to-Many)
  if (technologies && technologies.length > 0) {
    const techIds = await resolveTechnologies(technologies);

    if (techIds.length > 0) {
      const relationData = techIds.map((techId) => ({
        project_id: project.id,
        technology_id: techId,
      }));

      const { error: relError } = await supabase
        .from("project_technologies")
        .insert(relationData);

      if (relError) {
        // Transaction-safe cleanup: Delete the project if relation fails
        await supabase.from("projects").delete().eq("id", project.id);
        throw new Error(relError.message);
      }
    }
  }

  return project;
};

// Admin: Update Project
export const updateProjectService = async (
  id: string,
  data: Partial<ProjectFormValues>,
) => {
  const supabase = await createClient();
  // 1. Validate and construct database payload safely
  const projectData = projectDbSchema.parse(data);
  const { technologies } = data;

  // 2. Update Project Fields
  const { data: project, error } = await supabase
    .from("projects")
    .update({
      ...projectData,
      updated_at: new Date().toISOString(),
      // Update published_at only if status changes to published and it wasn't set?
      // Or just let user manage it? Simple logic: if status is published and no date, set it.
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Update Technologies (Replace all)
  if (technologies !== undefined) {
    // Delete existing relations
    const { error: delError } = await supabase
      .from("project_technologies")
      .delete()
      .eq("project_id", id);

    if (delError) throw new Error(delError.message);

    // Insert new ones efficiently
    const techIds = await resolveTechnologies(technologies);

    if (techIds.length > 0) {
      const relationData = techIds.map((techId) => ({
        project_id: id,
        technology_id: techId,
      }));

      const { error: relError } = await supabase
        .from("project_technologies")
        .insert(relationData);

      if (relError) throw new Error(relError.message);
    }
  }

  return project;
};

// Admin: Delete Project
export const deleteProjectService = async (id: string) => {
  const supabase = await createClient();
  // Soft delete
  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
};
