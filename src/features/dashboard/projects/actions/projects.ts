"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import {
  createProjectService,
  updateProjectService,
  deleteProjectService,
  getAdminProjectById,
  getAllTechnologies,
} from "../services/projects";
import { projectSchema, ProjectFormValues } from "../schemas/project";
import { createClient } from "@/lib/supabase/server";

export async function getTechnologiesAction() {
  try {
    const technologies = await getAllTechnologies();
    return { data: technologies, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch technologies";
    return { data: [], error: message };
  }
}

export async function createProjectAction(data: ProjectFormValues) {
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    return { data: null, error: validated.error.issues[0].message };
  }

  try {
    const project = await createProjectService(validated.data);

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    if (project.status === "published") {
      revalidatePath(`/projects/${project.slug}`);
    }

    return { data: project, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { data: null, error: message };
  }
}

export async function updateProjectAction(
  id: string,
  data: Partial<ProjectFormValues>,
) {
  // For partial update, we might need a partial schema or just skip strict zod if not all fields are present
  // But usually dashboard sends full data. Let's assume full data for robust validation if possible.
  const validated = projectSchema.safeParse(data);
  if (!validated.success) {
    // If it's a partial update (like toggle), we skip full schema validation or use .partial()
    // But here we use it for the main form.
    return { data: null, error: validated.error.issues[0].message };
  }

  try {
    const project = await updateProjectService(id, data);

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);

    return { data: project, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { data: null, error: message };
  }
}

export async function softDeleteProjectAction(id: string) {
  try {
    const project = await getAdminProjectById(id);
    await deleteProjectService(id);

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    if (project?.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }

    return { error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: message };
  }
}

export async function togglePublishAction(id: string) {
  try {
    const project = await getAdminProjectById(id);
    if (!project) throw new Error("Project not found");

    const newStatus = project.status === "published" ? "draft" : "published";
    const publishedAt =
      newStatus === "published"
        ? project.published_at || new Date().toISOString()
        : project.published_at;

    const supabase = await createClient();
    const { data: updated, error } = await supabase
      .from("projects")
      .update({
        status: newStatus,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${updated.slug}`);

    return { data: updated, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { data: null, error: message };
  }
}

export async function toggleFeaturedAction(id: string) {
  try {
    const project = await getAdminProjectById(id);
    if (!project) throw new Error("Project not found");

    const supabase = await createClient();
    const { data: updated, error } = await supabase
      .from("projects")
      .update({
        is_featured: !project.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${updated.slug}`);

    return { data: updated, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { data: null, error: message };
  }
}
