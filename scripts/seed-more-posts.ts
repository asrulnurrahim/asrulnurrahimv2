import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const additionalPosts = [
  {
    title: "Advanced React Patterns",
    slug: "advanced-react-patterns",
    excerpt:
      "Explore advanced design patterns in React for scalable applications.",
    tag: "React",
    content:
      "<h2>Compound Components</h2><p>Compound components provide a flexible way to build reusable UI.</p>",
  },
  {
    title: "TypeScript Utility Types",
    slug: "typescript-utility-types",
    excerpt:
      "Master the built-in utility types in TypeScript to write cleaner code.",
    tag: "TypeScript",
    content:
      "<h2>Partial and Required</h2><p>Learn how to transform types easily.</p>",
  },
  {
    title: "Modern CSS Techniques",
    slug: "modern-css-techniques",
    excerpt: "New CSS features that you should be using in 2026.",
    tag: "CSS",
    content:
      "<h2>Container Queries</h2><p>Responsive design based on container size, not viewport.</p>",
  },
  {
    title: "Next.js Middleware Guide",
    slug: "nextjs-middleware-guide",
    excerpt: "How to use Middleware in Next.js for authentication and routing.",
    tag: "Next.js",
    content:
      "<h2>Request Processing</h2><p>Intercept requests before they reach your page.</p>",
  },
  {
    title: "Web Accessibility Checklist",
    slug: "web-accessibility-checklist",
    excerpt: "A comprehensive checklist to ensure your site is accessible.",
    tag: "Accessibility",
    content:
      "<h2>Focus Management</h2><p>Manage focus properly for keyboard users.</p>",
  },
];

async function seed() {
  console.log("Seeding 5 additional posts...");

  // Get Author
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .single();
  const authorId = profile?.id;

  if (!authorId) {
    console.error("No profile found.");
    return;
  }

  // Get Categories
  const categoriesMap: Record<string, string> = {};
  const tags = [...new Set(additionalPosts.map((p) => p.tag))];

  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      categoriesMap[tag] = existing.id;
    } else {
      // Should already exist, but strict check
      console.warn(
        `Category ${tag} not found, skipping creation logic for simplicity.`,
      );
    }
  }

  // Insert Posts
  for (const post of additionalPosts) {
    const { title, slug, excerpt, content, tag } = post;
    const categoryId = categoriesMap[tag];

    console.log(`Creating post: ${title}`);

    // Check if post exists
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .single();

    let postId = existingPost?.id;

    if (postId) {
      console.log(`Post ${slug} already exists.`);
    } else {
      const { data: newPost, error } = await supabase
        .from("posts")
        .insert([
          {
            title,
            slug,
            excerpt,
            content,
            status: "published",
            published_at: new Date().toISOString(),
            author_id: authorId,
            views: Math.floor(Math.random() * 500),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating post:", error);
        continue;
      }
      postId = newPost.id;
    }

    // Link Category
    if (postId && categoryId) {
      // Clear existing
      await supabase.from("post_categories").delete().eq("post_id", postId);
      // Add new
      await supabase
        .from("post_categories")
        .insert([{ post_id: postId, category_id: categoryId }]);
    }
  }
  console.log("Seeding complete!");
}

seed().catch((err) => console.error(err));
