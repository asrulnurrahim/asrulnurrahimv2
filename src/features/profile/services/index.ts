import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "../types";

export const getProfileByUsername = async (username: string) => {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return null;
  return profile as Profile;
};

export const getOwnerProfile = async () => {
  const supabase = await createClient();
  // Try to find specific owner, or fallback to first profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", "asrulnurrahim") // default owner username
    .single();

  if (!profile) {
    const { data: first } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();
    profile = first;
  }

  return profile as Profile;
};
