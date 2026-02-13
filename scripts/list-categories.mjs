import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load env vars from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error.message);
    return;
  }

  console.log("Current Categories:");
  console.log(JSON.stringify(data, null, 2));
}

listCategories();
