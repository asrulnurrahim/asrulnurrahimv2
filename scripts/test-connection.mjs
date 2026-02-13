import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log("Testing connection to:", supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // 1. Test basic connection by fetching a single row from projects
    // We use .select('count') to be lightweight
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("❌ Connection Failed:", error.message);
      // Check for specific error codes if needed
      if (error.code === "PGRST301") {
        console.error("   Hint: JWT or RLS issue. Check your policies.");
      } else if (error.code === "42P01") {
        console.error(
          '   Hint: Table "projects" does not exist. Did you run the schema?',
        );
      }
      process.exit(1);
    }

    console.log(
      `✅ Connection Successful! Found ${count} items in "projects".`,
    );

    // 2. Test Posts connection
    const { count: postCount, error: postError } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (postError) {
      console.error("❌ Posts Table Access Failed:", postError.message);
    } else {
      console.log(`✅ "posts" table accessible. Found ${postCount} items.`);
    }
  } catch (err) {
    console.error("❌ Unexpected Error:", err);
  }
}

testConnection();
