import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./client";

/**
 * Uploads an image file to Supabase Storage.
 * @param file The file object to upload.
 * @param bucket The storage bucket name (default: "images").
 * @param client Optional Supabase client instance. If not provided, a new one is created.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(
  file: File,
  bucket: string = "images",
  client?: SupabaseClient,
): Promise<string> {
  const supabase = client || createClient();

  // Generate a unique file name
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
}
