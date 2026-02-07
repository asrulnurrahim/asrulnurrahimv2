import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfileSchema() {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);

  if (error) {
    console.error("Error fetching profiles:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Profile keys:", Object.keys(data[0]));
  } else {
    console.log("No profiles found to inspect.");
  }
}

checkProfileSchema();
