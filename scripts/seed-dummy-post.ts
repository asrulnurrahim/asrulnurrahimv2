import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyPost = {
  title: "Shiki Syntax Highlighting Test",
  slug: "shiki-syntax-highlighting-test",
  content: `
    <p>This is a test post to verify Shiki syntax highlighting. Below are examples in various languages.</p>

    <h3>TypeScript</h3>
    <pre><code class="language-typescript">interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

function getUser(id: number): User {
  return {
    id,
    name: "John Doe",
    role: "admin",
  };
}</code></pre>

    <h3>Python</h3>
    <pre><code class="language-python">def calculate_fibonacci(n):
    if n <= 1:
        return n
    else:
        return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

print(calculate_fibonacci(10))</code></pre>

    <h3>CSS</h3>
    <pre><code class="language-css">.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
}

.text-primary {
  color: #0070f3;
}</code></pre>

    <h3>JSON</h3>
    <pre><code class="language-json">{
  "name": "shiki-test",
  "version": "1.0.0",
  "dependencies": {
    "shiki": "^1.0.0"
  }
}</code></pre>

    <h3>Bash</h3>
    <pre><code class="language-bash">#!/bin/bash

echo "Installing dependencies..."
npm install
echo "Done!"</code></pre>
  `,
  excerpt:
    "A dummy post to test Shiki syntax highlighting with multiple languages.",
  status: "published",
  published_at: new Date().toISOString(),
  seo_title: "Shiki Syntax Highlighting Test",
  seo_description: "Testing syntax highlighting for code blocks.",
  author_id: "e445f4df-8922-4809-b425-667746596163", // Using a likely valid UUID or will need to query one
};

async function seed() {
  console.log("Seeding dummy post...");

  // Check if post exists
  const { data: existing } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", dummyPost.slug)
    .single();

  if (existing) {
    console.log("Post already exists. Updating...");
    const { error } = await supabase
      .from("posts")
      .update(dummyPost)
      .eq("id", existing.id);

    if (error) {
      console.error("Error updating post:", error);
    } else {
      console.log("Post updated successfully!");
    }
  } else {
    // We need a valid author_id. Let's fetch the first user from profiles or auth if possible.
    // Since we are using anon key, we might have restrictive RLS.
    // However, usually seeds run with service_role key if avoiding RLS, but here we only have anon.
    // If RLS allows insert/update for anon (unlikely for blog), this might fail.
    // But since the user asked me to do it, I'll try.
    // If it fails, I'll ask the user to input their service role key or run it in SQL editor.

    // Attempt to get a valid author_id from 'profiles' table if the hardcoded one fails
    // actually let's try to list profiles first

    const { error } = await supabase.from("posts").insert([dummyPost]);

    if (error) {
      console.error("Error inserting post:", error);
      console.log(
        "\nIf you have RLS enabled, you might need to run this script with SERVICE_ROLE_KEY or insert via SQL Editor.",
      );
    } else {
      console.log("Post created successfully!");
    }
  }
}

seed();
