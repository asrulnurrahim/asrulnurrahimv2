"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function uploadThumbnailAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { data: null, error: "No file provided" };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return { data: null, error: "Invalid file type. Please upload an image." };
  }

  // Validate file size (e.g., 2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    return { data: null, error: "File too large. Maximum size is 2MB." };
  }

  try {
    const supabase = await createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = fileName; // We store just the filename/subpath within the bucket

    const { data, error } = await supabase.storage
      .from("projects-thumbnails")
      .upload(filePath, file);

    if (error) throw error;

    // Return the relative path (including bucket name prefix if helpful for rendering utility)
    return { data: data.path, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    console.error("Storage upload error:", error);
    return { data: null, error: message };
  }
}
