import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Portfolio, Post } from "@/lib/types";

// Ensure we are using the private environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a server-side client per-request
export const createClient = async () => {
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

export const getPosts = async () => {
  const supabase = await createClient();
  // Using lowercase 'categories' and 'profiles' to match strict schema relationship names
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      "*, category:categories(name, slug), author:profiles(full_name, avatar_url)",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .returns<Post[]>();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return posts || [];
};

export const getPostBySlug = async (slug: string) => {
  const supabase = await createClient();
  // Using lowercase 'categories' and 'profiles' to match strict schema relationship names
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "*, category:categories(name, slug), author:profiles(full_name, avatar_url)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single<Post>();

  if (error) return null;
  return post;
};
