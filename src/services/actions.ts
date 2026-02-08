"use server";

import { createClient } from "@/lib/supabase/server";

export async function incrementView(slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_page_view", {
    post_slug: slug,
  });

  if (error) {
    console.error("Error incrementing view count:", error);
  }
}
