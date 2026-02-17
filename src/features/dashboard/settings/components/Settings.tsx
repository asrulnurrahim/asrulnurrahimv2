import { User } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";
import SettingsTabsComponent from "./SettingsTabs";

interface SettingsProps {
  user: User;
  profile: Profile | null;
}

export function Settings({ user, profile }: SettingsProps) {
  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Account Profile
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Home</span>
          <span>/</span>
          <span>Users</span>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400">
            Account Profile
          </span>
        </div>
      </div>

      <SettingsTabsComponent user={user} profile={profile} />
    </div>
  );
}
