import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Categories
  const CATEGORIES = [
    { name: "Tutorial", slug: "tutorial" },
    { name: "Technical Opinion", slug: "opinion" },
    { name: "Case Study", slug: "case-study" },
  ];
  const { error: catError } = await supabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "slug" });
  if (catError) console.error("❌ Error seeding categories:", catError.message);
  else console.log("✅ Categories seeded");

  // Get category IDs for linking
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug");
  const tutorialId = categories?.find((c) => c.slug === "tutorial")?.id;
  const opinionId = categories?.find((c) => c.slug === "opinion")?.id;

  // 2. Portfolios
  const PORTFOLIOS = [
    {
      slug: "e-commerce-dashboard",
      title: "E-commerce Analytics Dashboard",
      summary:
        "A comprehensive analytics dashboard for e-commerce businesses showing real-time sales data, inventory management, and customer insights.",
      tech_stack: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Recharts",
        "Supabase",
      ],
      status: "published",
      problem: "Clients struggled to visualize their sales data in real-time.",
      solution: "Built a real-time dashboard using Supabase subscriptions.",
      result: "Increased data visibility and decision making speed by 50%.",
    },
    {
      slug: "healthcare-portal",
      title: "Healthcare Patient Portal",
      summary:
        "Secure patient portal allowing appointment scheduling, medical record viewing, and direct messaging with healthcare providers.",
      tech_stack: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
      status: "published",
      problem: "Legacy system was slow and not mobile-friendly.",
      solution: "Rebuilt from scratch using modern stack and atomic design.",
      result: "Patient engagement increased by 30%.",
    },
  ];

  const { error: portError } = await supabase
    .from("portfolios")
    .upsert(PORTFOLIOS, { onConflict: "slug" });
  if (portError)
    console.error("❌ Error seeding portfolios:", portError.message);
  else console.log("✅ Portfolios seeded");

  // 3. Posts
  const POSTS = [
    {
      slug: "optimizing-font-loading",
      title: "Optimizing Web Font Loading",
      excerpt:
        "A deep dive into font loading strategies to prevent layout shifts and improve First Contentful Paint.",
      content:
        "Web fonts are a critical part of design but can significantly impact performance. In this article, we explore `font-display: swap`, preloading, and variable fonts.",
      status: "published",
      published_at: new Date().toISOString(),
      category_id: tutorialId,
    },
    {
      slug: "state-management-2024",
      title: "State Management in 2024",
      excerpt:
        "Comparing Redux Toolkit, Zustand, and React Context for modern application state management.",
      content:
        "With React Server Components changing the landscape, do we still need global client state? We analyze the trade-offs between different libraries.",
      status: "published",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      category_id: opinionId,
    },
  ];

  const { error: postError } = await supabase
    .from("posts")
    .upsert(POSTS, { onConflict: "slug" });
  if (postError) console.error("❌ Error seeding posts:", postError.message);
  else console.log("✅ Posts seeded");
}

seed();
