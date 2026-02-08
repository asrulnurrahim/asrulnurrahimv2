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

const dummyPosts = [
  {
    title: "Understanding React Server Components",
    slug: "understanding-react-server-components",
    excerpt:
      "A deep dive into how RSCs work and why they change the way we build React applications.",
    tag: "React",
    content: `
<h2>Introduction</h2>
<p>React Server Components (RSC) represent a major shift in how we think about building React applications. By allowing components to render exclusively on the server, we can reduce bundle sizes and improve initial load performance.</p>

<h3>Key Benefits</h3>
<p>One of the primary advantages is <strong>zero-bundle-size</strong> components. Libraries used only on the server are not included in the client bundle.</p>

<blockquote>
  "Server Components allow us to move data fetching logic to the server, closer to the data source."
</blockquote>

<h3>Code Example</h3>
<pre><code class="language-tsx">// Server Component
import db from './db';

async function Note({ id }) {
  const note = await db.notes.get(id);
  return (
    &lt;div&gt;
      &lt;h2&gt;{note.title}&lt;/h2&gt;
      &lt;p&gt;{note.body}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>Conclusion</h2>
<p>RSC is a game changer for performance and developer experience.</p>
    `,
  },
  {
    title: "Mastering TypeScript Generics",
    slug: "mastering-typescript-generics",
    excerpt:
      "Learn how to write flexible and reusable code with TypeScript Generics.",
    tag: "TypeScript",
    content: `
<h2>What are Generics?</h2>
<p>Generics allow you to create reusable components that work with a variety of types rather than a single one.</p>

<h3>Basic Syntax</h3>
<p>You can define a generic function using angle brackets.</p>

<pre><code class="language-typescript">function identity&lt;T&gt;(arg: T): T {
  return arg;
}

let output = identity&lt;string&gt;("myString");</code></pre>

<h3>Constraints</h3>
<p>Sometimes you want to limit the types that can be passed to a generic.</p>

<blockquote>
  "Generics provide a way to make components work with any data type and not restrict to one data type."
</blockquote>

<h4>Using extends keyof</h4>
<pre><code class="language-typescript">function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K) {
  return obj[key];
}</code></pre>
    `,
  },
  {
    title: "The Power of CSS Grid",
    slug: "power-of-css-grid",
    excerpt: "Create complex layouts easily with CSS Grid Layout.",
    tag: "CSS",
    content: `
<h2>Why CSS Grid?</h2>
<p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay out items in rows and columns.</p>

<h3>Grid Template Areas</h3>
<p>One of the most powerful features is named grid areas.</p>

<pre><code class="language-css">.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
}</code></pre>

<h3>Comparison with Flexbox</h3>
<p>While Flexbox is one-dimensional (row OR column), Grid is two-dimensional.</p>

<blockquote>
  "Grid is for layout, Flexbox is for alignment."
</blockquote>

<h4>Responsive Design</h4>
<p>Grid makes media queries much simpler.</p>
    `,
  },
  {
    title: "Optimizing Next.js Performance",
    slug: "optimizing-nextjs-performance",
    excerpt: "Tips and tricks to make your Next.js application fly.",
    tag: "Next.js",
    content: `
<h2>Image Optimization</h2>
<p>Always use the \`next/image\` component to automatically serve optimized images.</p>

<h3>Dynamic Imports</h3>
<p>Load components only when they are needed.</p>

<pre><code class="language-tsx">import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => &lt;p&gt;Loading...&lt;/p&gt;,
});</code></pre>

<h2>Route Handlers</h2>
<p>Use Route Handlers for backend logic.</p>

<blockquote>
  "Performance is not just a metric, it's a user experience feature."
</blockquote>
    `,
  },
  {
    title: "State Management with Zustand",
    slug: "state-management-zustand",
    excerpt:
      "A simple, fast and scalable bear-bones state-management solution.",
    tag: "React",
    content: `
<h2>Why Zustand?</h2>
<p>Zustand is small, fast, and scalable. It has a comfortable API based on hooks.</p>

<h3>Creating a Store</h3>
<pre><code class="language-typescript">import { create } from 'zustand'

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))</code></pre>

<h3>Using the Store</h3>
<p>Bind components to the store state.</p>

<h2>Comparison with Redux</h2>
<p>Zustand is much less boilerplate-heavy than Redux.</p>

<blockquote>
  "Simplicity is the soul of efficiency."
</blockquote>
    `,
  },
  {
    title: "Building Accessible Web Apps",
    slug: "building-accessible-web-apps",
    excerpt: "Ensuring your web applications are usable by everyone.",
    tag: "Accessibility",
    content: `
<h2>Semantic HTML</h2>
<p>Use the correct HTML tags for the job. Button for actions, Anchor for links.</p>

<h3>ARIA Labels</h3>
<p>When visual cues aren't enough, use ARIA attributes.</p>

<pre><code class="language-html">&lt;button aria-label="Close menu"&gt;X&lt;/button&gt;</code></pre>

<h3>Keyboard Navigation</h3>
<p>Ensure all interactive elements are focusable and usable with a keyboard.</p>

<blockquote>
  "The power of the Web is in its universality." - Tim Berners-Lee
</blockquote>

<h4>Testing</h4>
<p>Use tools like Lighthouse and Axe to test accessibility.</p>
    `,
  },
  {
    title: "Introduction to PostgreSQL",
    slug: "introduction-to-postgresql",
    excerpt:
      "Getting started with the world's most advanced open source relational database.",
    tag: "Database",
    content: `
<h2>Features</h2>
<p>PostgreSQL is known for its reliability, feature robustness, and performance.</p>

<h3>JSONB Support</h3>
<p>Postgres has excellent support for JSON data, allowing NoSQL-like capabilities.</p>

<pre><code class="language-sql">SELECT content->>'title' FROM documents;</code></pre>

<h3>Extensions</h3>
<p>PostGIS is a popular extension for geographic objects.</p>

<blockquote>
  "Data is the new oil."
</blockquote>

<h2>Indexing</h2>
<p>Proper indexing is crucial for performance.</p>
    `,
  },
  {
    title: "Deploying with Vercel",
    slug: "deploying-with-vercel",
    excerpt: "How to deploy your Next.js application to Vercel in minutes.",
    tag: "DevOps",
    content: `
<h2>Zero Configuration</h2>
<p>Vercel detects your framework and configures the build settings automatically.</p>

<h3>Preview Deployments</h3>
<p>Every pull request gets its own live preview URL.</p>

<pre><code class="language-bash">vercel --prod</code></pre>

<h3>Edge Functions</h3>
<p>Run code at the edge, closer to your users.</p>

<blockquote>
  "Develop. Preview. Ship."
</blockquote>

<h4>Environment Variables</h4>
<p>Manage secrets securely in the dashboard.</p>
    `,
  },
];

async function seed() {
  console.log("Seeding dummy posts...");

  // Get or Create Author (First Profile) - fallback to a dummy ID if none exists (though foreign key might fail)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .limit(1)
    .single();
  const authorId = profile?.id;

  if (!authorId) {
    console.error(
      "No profile found. Please ensure a user profile exists first.",
    );
    return;
  }

  // Ensure Categories Exist
  const categoriesMap: Record<string, string> = {};
  const tags = [...new Set(dummyPosts.map((p) => p.tag))];

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
      const { data: newCat, error } = await supabase
        .from("categories")
        .insert([{ name: tag, slug }])
        .select()
        .single();

      if (error) {
        console.error(`Error creating category ${tag}:`, error);
        continue;
      }
      categoriesMap[tag] = newCat.id;
    }
  }

  // Insert Posts
  for (const post of dummyPosts) {
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
      console.log(`Post ${slug} already exists, skipping creation.`);
    } else {
      const { data: newPost, error: postError } = await supabase
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
            views: Math.floor(Math.random() * 1000),
          },
        ])
        .select()
        .single();

      if (postError) {
        console.error(`Error processing post ${slug}:`, postError);
        continue;
      }
      postId = newPost.id;
    }

    // Link Category
    if (postId && categoryId) {
      // Clear existing links
      const { error: delError } = await supabase
        .from("post_categories")
        .delete()
        .eq("post_id", postId);

      if (delError) console.error("Error clearing cats:", delError);

      // Add link
      const { error: insError } = await supabase
        .from("post_categories")
        .insert([
          {
            post_id: postId,
            category_id: categoryId,
          },
        ]);

      if (insError) console.error("Error linking cat:", insError);
    }
  }

  console.log("Seeding complete!");
}

seed().catch((err) => console.error(err));
