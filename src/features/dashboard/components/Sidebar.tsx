"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Settings,
  User,
  Grid,
  LayoutDashboard,
  FileText,
  Plus,
  ChevronDown,
  ChevronUp,
  Tag,
  Briefcase,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function Sidebar({
  isOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const supabase = createClient();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, headline")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    getProfile();
  }, [supabase]);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 h-screen w-[280px] border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex h-full flex-col">
        {/* Header / Logo */}
        <div className="flex h-[74px] items-center border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="animate-[move-bg_20s_linear_infinite] bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] bg-clip-text text-xl font-bold text-transparent">
                {profile?.full_name || "Asrul Nur Rahim"}
              </span>
            </Link>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              v1.0.0
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                {profile?.avatar_url ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={profile.avatar_url}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h6 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {profile?.full_name || "User"}
                </h6>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {profile?.headline || "Member"}
                </p>
              </div>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-1 overflow-y-auto px-4 py-2">
          <div className="mt-2 mb-2 px-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Navigation
          </div>

          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />

          <div className="mt-6 mb-2 px-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Management
          </div>
          <NavItem
            href="/dashboard/profile"
            icon={<User className="h-5 w-5" />}
            label="Profile"
            isActive={pathname === "/dashboard/profile"}
          />

          <NavGroup
            label="Blog Posts"
            icon={<FileText className="h-5 w-5" />}
            isActive={
              pathname.startsWith("/dashboard/posts") ||
              pathname.startsWith("/dashboard/categories") ||
              pathname.startsWith("/dashboard/tags")
            }
          >
            <NavItem
              href="/dashboard/posts"
              icon={<FileText className="h-4 w-4" />}
              label="All Posts"
              isActive={pathname === "/dashboard/posts"}
            />
            <NavItem
              href="/dashboard/posts/create"
              icon={<Plus className="h-4 w-4" />}
              label="New Post"
              isActive={pathname === "/dashboard/posts/create"}
            />
            <NavItem
              href="/dashboard/categories"
              icon={<Grid className="h-4 w-4" />}
              label="Categories"
              isActive={pathname === "/dashboard/categories"}
            />
            <NavItem
              href="/dashboard/tags"
              icon={<Tag className="h-4 w-4" />}
              label="Tags"
              isActive={pathname === "/dashboard/tags"}
            />
          </NavGroup>

          <NavGroup
            label="Projects"
            icon={<Briefcase className="h-5 w-5" />}
            isActive={pathname.startsWith("/dashboard/projects")}
          >
            <NavItem
              href="/dashboard/projects"
              icon={<Briefcase className="h-4 w-4" />}
              label="All Projects"
              isActive={pathname === "/dashboard/projects"}
            />
            <NavItem
              href="/dashboard/projects/create"
              icon={<Plus className="h-4 w-4" />}
              label="New Project"
              isActive={pathname === "/dashboard/projects/create"}
            />
          </NavGroup>

          <NavItem
            href="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            isActive={pathname === "/dashboard/settings"}
          />
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          : "text-gray-600 hover:bg-slate-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function NavGroup({
  label,
  icon,
  children,
  isActive,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  // Auto-expand if active
  // Effect removed intentionally to avoid set-state-in-effect error.
  // The 'isActive' prop controls the initial state, but user can toggle it manually.
  // If strict sync is needed, we should control 'isOpen' from parent or use a different pattern.
  // For now, initializing state with isActive is sufficient.

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 hover:bg-slate-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {label}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4 opacity-50" />
        )}
      </button>
      {isOpen && <div className="mt-1 space-y-1 pl-4">{children}</div>}
    </div>
  );
}
