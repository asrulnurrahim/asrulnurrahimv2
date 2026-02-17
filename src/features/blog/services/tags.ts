"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Tag } from "../types";

export const getTags = async () => {
  const supabase = await createClient();
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true })
    .returns<Tag[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return tags || [];
};

export const getTagBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data: tag, error } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return tag as Tag;
};
