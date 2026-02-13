"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function incrementView(slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_page_view", {
    post_slug: slug,
  });

  if (error) {
    console.error("Error incrementing view count:", error);
  }
}

// --- Tag Actions ---

export async function createTag(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;

  if (!slug) {
    slug = name;
  }

  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const { error } = await supabase.from("tags").insert([{ name, slug }]);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/dashboard/tags");
  return { message: "Success" };
}

export async function updateTag(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;

  if (!slug) {
    slug = name;
  }

  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const { error } = await supabase
    .from("tags")
    .update({ name, slug })
    .eq("id", id);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/dashboard/tags");
  return { message: "Success" };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/dashboard/tags");
  return { message: "Success" };
}
