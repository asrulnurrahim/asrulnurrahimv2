import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsTabs from "@/components/dashboard/settings/SettingsTabs";

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

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Account Profile
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
          <span>Home</span>
          <span>/</span>
          <span>Users</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400">
            Account Profile
          </span>
        </div>
      </div>

      <SettingsTabs user={user} profile={profile} />
    </div>
  );
}
