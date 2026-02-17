import "server-only";
import { createClient } from "@/lib/supabase/server";

export const getDashboardStats = async () => {
  const supabase = await createClient();

  const [postsRes, projectsRes, categoriesRes, viewsRes, recentPostsRes] =
    await Promise.all([
      // Total Published Posts
      supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .is("deleted_at", null),

      // Total Published Projects
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "published")
        .is("deleted_at", null),

      // Total Categories
      supabase.from("categories").select("*", { count: "exact", head: true }),

      // Total Views (Sum of all post views)
      supabase.from("posts").select("views").is("deleted_at", null),

      // Recent Posts
      supabase
        .from("posts")
        .select(
          "id, title, slug, published_at, status, views, categories(name, color)",
        )
        .is("deleted_at", null)
        .order("published_at", { ascending: false })
        .limit(5),
    ]);

  const totalViews =
    viewsRes.data?.reduce((acc, curr) => acc + (curr.views || 0), 0) || 0;

  return {
    counts: {
      posts: postsRes.count || 0,
      projects: projectsRes.count || 0,
      categories: categoriesRes.count || 0,
      views: totalViews,
    },
    recentPosts: recentPostsRes.data || [],
  };
};
