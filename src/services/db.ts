import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Portfolio, Post, Category } from "@/lib/types";

// Ensure we are using the private environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Create a server-side client per-request
export const createClient = async () => {
  try {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  } catch {
    // Fallback for static generation (SSG) or where request scope is unavailable
    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
};

// --- Data Access Layer ---

export const getProjects = async () => {
  const supabase = await createClient();
  const { data: portfolios, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<Portfolio[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return portfolios || [];
};

export const getFeaturedProjects = async (limit = 3) => {
  const supabase = await createClient();
  const { data: portfolios, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Portfolio[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return portfolios || [];
};

export const getProjectBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single<Portfolio>();

  if (error) return null;
  return portfolio;
};

export const getPosts = async (search?: string, categorySlug?: string) => {
  const supabase = await createClient();
  let postIds: string[] | null = null;

  // Step 1: Filter by category if provided
  if (categorySlug) {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("post_categories")
      .select("post_id, category:categories!inner(slug)")
      .eq("category.slug", categorySlug);

    if (categoriesError)
      throw new Error(`Supabase error: ${categoriesError.message}`);

    postIds = categoriesData.map((item) => item.post_id);

    // If no posts found for this category, return empty immediately
    if (postIds.length === 0) return [];
  }

  // Step 2: Fetch posts (filtering by IDs if needed)
  let query = supabase
    .from("posts")
    .select(
      "*, post_cats:post_categories(category:categories(id, name, slug)), author:profiles(full_name, avatar_url)",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  if (postIds !== null) {
    query = query.in("id", postIds);
  }

  // We need to transform the result because Supabase returns:
  // categories: [{ category: { name: '...', slug: '...' } }, ...]
  // We want: categories: [{ name: '...', slug: '...' }, ...]
  const { data: posts, error } = await query;

  if (error) throw new Error(`Supabase error: ${error.message}`);

  // Transform the data to match the expected Post interface
  return (posts || []).map((post) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = post as any;
    return {
      ...p,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: p.post_cats
        .map((c: any) => c.category)
        .filter((c: any) => c !== null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: p.post_cats[0]?.category || null, // Backward compatibility
    };
  }) as Post[];
};

export const getRecentPosts = async (limit = 5) => {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, published_at, thumbnail, excerpt, post_cats:post_categories(category:categories(id, name, slug))",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Supabase error: ${error.message}`);

  // Transform
  return (posts || []).map((post) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = post as any;
    return {
      ...p,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: p.post_cats
        .map((c: any) => c.category)
        .filter((c: any) => c !== null),
    };
  }) as Post[];
};

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

export const getPostBySlug = async (slug: string) => {
  const supabase = await createClient();
  // Using lowercase 'categories' and 'profiles' to match strict schema relationship names
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "*, post_cats:post_categories(category:categories(id, name, slug)), author:profiles(full_name, avatar_url)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = post as any;
  return {
    ...p,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: p.post_cats
      .map((c: any) => c.category)
      .filter((c: any) => c !== null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: p.post_cats[0]?.category || null,
  } as Post;
};

export const getOwnerProfile = async () => {
  const supabase = await createClient();
  // Assuming single-user blog/portfolio, fetch the first profile
  // In a multi-user app, you'd filter by role or specific ID
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error) return null;
  return profile;
};

// Blog Posts
export const getDashboardPosts = async () => {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*, author:profiles(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return posts;
};

export const getPost = async (id: string) => {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*, post_cats:post_categories(category:categories(id, name, slug))")
    .eq("id", id)
    .single();

  if (error) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = post as any;
  return {
    ...p,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: p.post_cats
      .map((c: any) => c.category)
      .filter((c: any) => c !== null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: p.post_cats[0]?.category || null,
  } as Post;
};

export const createPost = async (
  post: Partial<Post>,
  categoryIds?: string[],
) => {
  const supabase = await createClient();
  // Remove fields that are not columns in 'posts' table
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { categories, category, author, ...postData } = post;

  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select()
    .single();

  if (error) throw error;

  if (categoryIds && categoryIds.length > 0) {
    const postCategories = categoryIds.map((catId) => ({
      post_id: data.id,
      category_id: catId,
    }));

    const { error: catError } = await supabase
      .from("post_categories")
      .insert(postCategories);

    if (catError) throw catError;
  }

  return data;
};

export const updatePost = async (
  id: string,
  post: Partial<Post>,
  categoryIds?: string[],
) => {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { categories, category, author, ...postData } = post;

  const { data, error } = await supabase
    .from("posts")
    .update(postData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (categoryIds !== undefined) {
    // Delete existing
    const { error: deleteError } = await supabase
      .from("post_categories")
      .delete()
      .eq("post_id", id);
    if (deleteError) throw deleteError;

    // Insert new
    if (categoryIds.length > 0) {
      const postCategories = categoryIds.map((catId) => ({
        post_id: id,
        category_id: catId,
      }));

      const { error: insertError } = await supabase
        .from("post_categories")
        .insert(postCategories);
      if (insertError) throw insertError;
    }
  }

  return data;
};

export const deletePost = async (id: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
};

export const getRelatedPosts = async (
  currentPostId: string,
  categoryIds: string[],
  limit = 3,
) => {
  const supabase = await createClient();

  if (categoryIds.length === 0) return [];

  // Get candidate post IDs
  const { data: candidates, error: candidateError } = await supabase
    .from("post_categories")
    .select("post_id")
    .in("category_id", categoryIds);

  if (candidateError) throw new Error(candidateError.message);

  const candidateIds = new Set(
    candidates.map((c) => c.post_id).filter((id) => id !== currentPostId),
  );

  if (candidateIds.size === 0) return [];

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, published_at, thumbnail, excerpt, post_cats:post_categories(category:categories(id, name, slug))",
    )
    .in("id", Array.from(candidateIds))
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  // Transform
  return (posts || []).map((post) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = post as any;
    return {
      ...p,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: p.post_cats
        .map((c: any) => c.category)
        .filter((c: any) => c !== null),
    };
  }) as Post[];
};
