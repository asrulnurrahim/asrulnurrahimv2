import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { Post, DashboardPostsOptions, Category, Tag } from "../types";
import { Profile } from "@/features/profile/types";

// Helper interface for Supabase response structure
interface SupabasePostRow {
  id: string;
  title: string;
  slug: string;
  views: number;
  excerpt: string | null;
  content: string | null;
  thumbnail: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Relations (might be missing depending on query)
  post_cats?: { category: Category | null }[];
  post_tags?: { tag: Tag | null }[];
  author?:
    | { full_name: string | null; avatar_url: string | null }
    | Profile
    | null;
}

export const getPosts = async (search?: string, categorySlug?: string) => {
  const supabase = createStaticClient();
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
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
      // Backward compatibility
      category: p.post_cats?.[0]?.category || null,
    } as Post;
  });
};

export const getPaginatedPosts = async (
  page = 1,
  limit = 10,
  search?: string,
  categorySlug?: string,
  tagSlug?: string,
) => {
  const supabase = createStaticClient();
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
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
      tags:
        p.post_tags?.map((t) => t.tag).filter((t): t is Tag => t !== null) ||
        [],
      category: p.post_cats?.[0]?.category || null, // Backward compatibility
    } as Post;
  });

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
  const supabase = createStaticClient();
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
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
      category: p.post_cats?.[0]?.category || null, // Backward compatibility
    } as Post;
  });

  return result;
};

export const getPopularPosts = async (limit = 5) => {
  const supabase = createStaticClient();
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
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
      category: p.post_cats?.[0]?.category || null, // Backward compatibility
    } as Post;
  });

  return result;
};

export const getPostBySlug = async (slug: string) => {
  const supabase = createStaticClient();
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

  const p = post as unknown as SupabasePostRow;
  return {
    ...p,
    categories:
      p.post_cats
        ?.map((c) => c.category)
        .filter((c): c is Category => c !== null) || [],
    tags:
      p.post_tags?.map((t) => t.tag).filter((t): t is Tag => t !== null) || [],
    category: p.post_cats?.[0]?.category || null,
  } as Post;
};

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

  // Status Filter
  if (options.status && options.status !== "all") {
    dbQuery = dbQuery.eq("status", options.status);
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

  if (error) throw new Error(`Supabase error: ${error.message}`);

  // Transform
  const transformedData = (posts || []).map((post: unknown) => {
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
      tags:
        p.post_tags?.map((t) => t.tag).filter((t): t is Tag => t !== null) ||
        [],
    } as Post;
  });

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

  const p = post as unknown as SupabasePostRow;
  return {
    ...p,
    categories:
      p.post_cats
        ?.map((c) => c.category)
        .filter((c): c is Category => c !== null) || [],
    tags:
      p.post_tags?.map((t) => t.tag).filter((t): t is Tag => t !== null) || [],
    category: p.post_cats?.[0]?.category || null,
  } as Post;
};

export const createPost = async (
  post: Partial<Post>,
  categoryIds?: string[],
  tagIds?: string[],
) => {
  const supabase = await createClient();
  // Remove fields that are not columns in 'posts' table
  const { ...postData } = post;

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

  if (tagIds && tagIds.length > 0) {
    const postTags = tagIds.map((tagId) => ({
      post_id: data.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("post_tags")
      .insert(postTags);

    if (tagError) throw tagError;
  }

  return data;
};

export const updatePost = async (
  id: string,
  post: Partial<Post>,
  categoryIds?: string[],
  tagIds?: string[],
) => {
  const supabase = await createClient();
  const { ...postData } = post;

  const { data, error } = await supabase
    .from("posts")
    .update(postData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (categoryIds !== undefined) {
    // Delete existing categories
    const { error: deleteError } = await supabase
      .from("post_categories")
      .delete()
      .eq("post_id", id);
    if (deleteError) throw deleteError;

    // Insert new categories
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

  if (tagIds !== undefined) {
    // Delete existing tags
    const { error: deleteError } = await supabase
      .from("post_tags")
      .delete()
      .eq("post_id", id);
    if (deleteError) throw deleteError;

    // Insert new tags
    if (tagIds.length > 0) {
      const postTags = tagIds.map((tagId) => ({
        post_id: id,
        tag_id: tagId,
      }));

      const { error: insertError } = await supabase
        .from("post_tags")
        .insert(postTags);
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
  const supabase = createStaticClient();

  if (categoryIds.length === 0) return [];

  // Get candidate post IDs
  const { data: candidates, error: candidateError } = await supabase
    .from("post_categories")
    .select("post_id")
    .in("category_id", categoryIds);

  if (candidateError) {
    console.error(
      "Error fetching related posts candidates:",
      JSON.stringify(candidateError, null, 2),
    );
    return [];
  }

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

  if (error) {
    console.error(
      "Error fetching related posts:",
      JSON.stringify(error, null, 2),
    );
    return [];
  }

  // Transform
  return (posts || []).map((post) => {
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
    } as Post;
  });
};

export const getPostsByAuthor = async (
  authorId: string,
  page = 1,
  limit = 10,
) => {
  const supabase = createStaticClient();
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
    const p = post as unknown as SupabasePostRow;
    return {
      ...p,
      categories:
        p.post_cats
          ?.map((c) => c.category)
          .filter((c): c is Category => c !== null) || [],
    } as Post;
  });

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
