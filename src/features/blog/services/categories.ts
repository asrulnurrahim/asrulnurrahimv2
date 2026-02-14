import { createClient } from "@/lib/supabase/server";
import { Category } from "../types";

export const getCategories = async () => {
  const supabase = await createClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*, posts:post_categories(count)") // Use post_categories to count
    .order("name", { ascending: true })
    .returns<Category[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return categories || [];
};

export const getCategoryBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return category as Category;
};

export const createCategory = async (category: Partial<Category>) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (
  id: string,
  category: Partial<Category>,
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
};
