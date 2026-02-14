import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings } from "@/features/dashboard/views";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <Settings user={user} profile={profile} />;
}
