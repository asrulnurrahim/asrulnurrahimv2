import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Project, Post, Category, Tag } from "@/lib/types";

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
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .returns<Project[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return projects || [];
};

export const getFeaturedProjects = async (limit = 3) => {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<Project[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return projects || [];
};

export const getProjectBySlug = async (slug: string) => {
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single<Project>();

  if (error) return null;
  return project;
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
      "*, post_cats:post_categories(category:categories(id, name, slug, color, description)), author:profiles(full_name, avatar_url)",
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

export const getPaginatedPosts = async (
  page = 1,
  limit = 10,
  search?: string,
  categorySlug?: string,
  tagSlug?: string,
) => {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  let postIds: string[] | null = null;
  let tagPostIds: string[] | null = null;

  // Step 1: Filter by category if provided
  if (categorySlug) {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("post_categories")
      .select("post_id, category:categories!inner(slug)")
      .eq("category.slug", categorySlug);

    if (categoriesError)
      throw new Error(`Supabase error: ${categoriesError.message}`);

    postIds = categoriesData.map((item) => item.post_id);

    if (postIds.length === 0) {
      return {
        data: [],
        meta: { total: 0, page, limit, last_page: 0 },
      };
    }
  }

  // Step 2: Filter by tag if provided
  if (tagSlug) {
    const { data: tagsData, error: tagsError } = await supabase
      .from("post_tags")
      .select("post_id, tag:tags!inner(slug)")
      .eq("tag.slug", tagSlug);

    if (tagsError) throw new Error(`Supabase error: ${tagsError.message}`);

    tagPostIds = tagsData.map((item) => item.post_id);

    if (tagPostIds.length === 0) {
      return {
        data: [],
        meta: { total: 0, page, limit, last_page: 0 },
      };
    }
  }

  // Step 3: Fetch posts
  let query = supabase
    .from("posts")
    .select(
      "*, post_cats:post_categories(category:categories(id, name, slug, color, description)), post_tags:post_tags(tag:tags(id, name, slug)), author:profiles(full_name, avatar_url)",
      { count: "exact" },
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

  if (tagPostIds !== null) {
    // If we have both category and tag filters, we need the intersection
    if (postIds !== null) {
      const intersection = postIds.filter((id) => tagPostIds!.includes(id));
      if (intersection.length === 0) {
        return {
          data: [],
          meta: { total: 0, page, limit, last_page: 0 },
        };
      }
      query = query.in("id", intersection);
    } else {
      query = query.in("id", tagPostIds);
    }
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data: posts, error, count } = await query;

  if (error) throw new Error(`Supabase error: ${error.message}`);

  // Transform
  const transformedData = (posts || []).map((post) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = post as any;
    return {
      ...p,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: p.post_cats
        .map((c: any) => c.category)
        .filter((c: any) => c !== null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: p.post_tags?.map((t: any) => t.tag).filter((t: any) => t !== null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: p.post_cats[0]?.category || null, // Backward compatibility
    };
  }) as Post[];

  return {
    data: transformedData,
    meta: {
      total: count || 0,
      page,
      limit,
      last_page: Math.ceil((count || 0) / limit),
    },
  };
};

export const getRecentPosts = async (limit = 5) => {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, published_at, thumbnail, excerpt, post_cats:post_categories(category:categories(id, name, slug, color, description))",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }

  // Transform
  const result = (posts || []).map((post) => {
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

  return result;
};

export const getPopularPosts = async (limit = 5) => {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, published_at, views, post_cats:post_categories(category:categories(id, name, slug, color, description))",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching popular posts:", error);
    return [];
  }

  const result = (posts || []).map((post) => {
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

  return result;
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

// Tags
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

export const getPostBySlug = async (slug: string) => {
  const supabase = await createClient();
  // Using lowercase 'categories' and 'profiles' to match strict schema relationship names
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "*, post_cats:post_categories(category:categories(id, name, slug, color, description)), post_tags:post_tags(tag:tags(id, name, slug)), author:profiles(full_name, avatar_url)",
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
    tags: p.post_tags?.map((t: any) => t.tag).filter((t: any) => t !== null),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: p.post_cats[0]?.category || null,
  } as Post;
};

export const getOwnerProfile = async () => {
  const supabase = await createClient();
  // Assuming single-user blog/projects, fetch the first profile
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
export interface DashboardPostsOptions {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export const getDashboardPosts = async (
  options: DashboardPostsOptions = {},
) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sort = "created_at",
    order = "desc",
  } = options;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let dbQuery = supabase
    .from("posts")
    .select(
      "*, author:profiles(*), post_cats:post_categories(category:categories(id, name, slug, color, description))",
      { count: "exact" },
    );

  // Search
  if (query) {
    dbQuery = dbQuery.ilike("title", `%${query}%`);
  }

  // Sort
  if (sort === "author") {
    dbQuery = dbQuery.order("full_name", {
      foreignTable: "profiles",
      ascending: order === "asc",
    });
  } else if (sort === "category") {
    // Sorting by M2M relation is complex, skip for now or default to created_at
    dbQuery = dbQuery.order("created_at", { ascending: order === "asc" });
  } else {
    // Default column sort
    dbQuery = dbQuery.order(sort, { ascending: order === "asc" });
  }

  // Pagination
  const {
    data: posts,
    error,
    count,
  } = await dbQuery.range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching posts:", error);
    return { data: [], meta: { total: 0, page, last_page: 0 } };
  }

  // Transform
  const transformedData = (posts || []).map((post) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = post as any;
    return {
      ...p,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: p.post_cats
        .map((c: any) => c.category)
        .filter((c: any) => c !== null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: p.post_tags?.map((t: any) => t.tag).filter((t: any) => t !== null),
    };
  }) as Post[];

  return {
    data: transformedData,
    meta: {
      total: count || 0,
      page,
      last_page: Math.ceil((count || 0) / limit),
    },
  };
};

export const getPost = async (id: string) => {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "*, post_cats:post_categories(category:categories(id, name, slug, color, description)), post_tags:post_tags(tag:tags(id, name, slug))",
    )
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
    tags: p.post_tags?.map((t: any) => t.tag).filter((t: any) => t !== null),
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
      "id, title, slug, published_at, thumbnail, excerpt, post_cats:post_categories(category:categories(id, name, slug, color, description))",
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

// Authors
export const getProfileByUsername = async (username: string) => {
  const supabase = await createClient();
  // Since we don't have a username column, we fetch all profiles and filter by slugified name
  // This is not efficient for large datasets but acceptable for < 100 users
  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) return null;

  // Simple slugify for comparison
  const slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  const profile = profiles.find((p) => slugify(p.full_name || "") === username);

  return profile || null;
};

export const getPostsByAuthor = async (
  authorId: string,
  page = 1,
  limit = 10,
) => {
  const supabase = await createClient();
  const offset = (page - 1) * limit;

  const {
    data: posts,
    error,
    count,
  } = await supabase
    .from("posts")
    .select(
      "id, title, slug, published_at, thumbnail, excerpt, post_cats:post_categories(category:categories(id, name, slug, color, description))",
      { count: "exact" },
    )
    .eq("author_id", authorId)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching author posts:", error);
    return { data: [], meta: { total: 0, page, limit, last_page: 0 } };
  }

  // Transform
  const transformedData = (posts || []).map((post) => {
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

  return {
    data: transformedData,
    meta: {
      total: count || 0,
      page,
      limit,
      last_page: Math.ceil((count || 0) / limit),
    },
  };
};
