"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, Lock } from "lucide-react";
import ProfileForm from "../forms/ProfileForm";
import SecurityForm from "../forms/SecurityForm";
import AvatarUploadWrapper from "./AvatarUploadWrapper";

interface SettingsTabsProps {
  user: User;
  profile: {
    full_name: string | null;
    headline: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null;
}

export default function SettingsTabs({ user, profile }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "security">(
    "personal",
  );

  return (
    <div className="col-span-12">
      <div className="card mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="card-body px-6 !py-0">
          <ul className="nav-tabs flex w-full flex-wrap border-b border-gray-200 text-center font-medium dark:border-gray-800">
            <li className="group">
              <button
                onClick={() => setActiveTab("personal")}
                className={`mr-6 inline-flex items-center border-b-2 py-4 transition-all duration-300 ease-linear ${
                  activeTab === "personal"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                }`}
              >
                <UserIcon className="mr-2 h-5 w-5" />
                Personal Details
              </button>
            </li>
            <li className="group">
              <button
                onClick={() => setActiveTab("security")}
                className={`mr-6 inline-flex items-center border-b-2 py-4 transition-all duration-300 ease-linear ${
                  activeTab === "security"
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                }`}
              >
                <Lock className="mr-2 h-5 w-5" />
                Change Password
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "personal" && (
          <div className="animate-in fade-in grid grid-cols-12 gap-6 duration-300">
            {/* Avatar Card */}
            <div className="col-span-12 lg:col-span-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4">
                  <AvatarUploadWrapper
                    user={user}
                    url={profile?.avatar_url || null}
                  />
                </div>
                <h5 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">
                  {profile?.full_name || "User"}
                </h5>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                  {profile?.headline || "No headline set"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {profile?.bio || "No bio set"}
                </p>
              </div>
            </div>

            {/* Profile Form Card */}
            <div className="col-span-12 lg:col-span-8">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                  <h5 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Personal Information
                  </h5>
                </div>
                <div className="p-6">
                  <ProfileForm user={user} profile={profile} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="animate-in fade-in grid grid-cols-12 gap-6 duration-300">
            <div className="col-span-12">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                  <h5 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Security Settings
                  </h5>
                </div>
                <div className="p-6">
                  <SecurityForm />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
