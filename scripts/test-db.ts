import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
const result = dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

if (result.error) {
  console.error("Error loading .env.local:", result.error);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Checking DB Connection...");
console.log("URL:", SUPABASE_URL ? "Defined" : "Undefined");
console.log("KEY:", SUPABASE_ANON_KEY ? "Defined" : "Undefined");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFetch() {
  try {
    // Test access to post_categories
    console.log("Testing access to 'post_categories'...");
    const { data: cats, error: catError } = await supabase
      .from("post_categories")
      .select("*")
      .limit(1);

    if (catError) {
      console.error(
        "Error accessing post_categories:",
        JSON.stringify(catError, null, 2),
      );
    } else {
      console.log("Success! Fetched", cats.length, "post_categories rows.");
    }

    const { data, error } = await supabase
      .from("posts")
      .select("id, title")
      .limit(1);

    if (error) {
      console.error("Supabase Error:", JSON.stringify(error, null, 2));
      console.error("Full Error Object:", error);
    } else {
      console.log("Success! Fetched", data.length, "posts.");
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
}

testFetch();
