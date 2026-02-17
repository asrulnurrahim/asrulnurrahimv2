import { createStaticClient } from "@/lib/supabase/static";

/**
 * Derives the public URL for a project thumbnail.
 * Supports legacy full URLs (thumbnail) and new relative paths (thumbnail_path).
 */
export const getProjectThumbnailUrl = (
  thumbnail: string | null | undefined,
  thumbnailPath: string | null | undefined,
): string => {
  if (thumbnail) return thumbnail;

  if (thumbnailPath) {
    const supabase = createStaticClient();
    const { data } = supabase.storage
      .from("projects-thumbnails")
      .getPublicUrl(thumbnailPath);
    return data.publicUrl;
  }

  return "";
};
