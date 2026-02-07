"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
    headline: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, headline")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, headline")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-3 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full lg:rounded-lg transition-colors outline-none cursor-pointer group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs text-slate-500 font-bold">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
          </div>
          <div className="hidden xl:block text-left mr-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
              {profile?.headline || "Member"}
            </p>
          </div>
          <div
            className={`hidden xl:block text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={16} />
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[240px] bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 p-1 mr-4 z-50 animate-in fade-in zoom-in-95 duration-200 slide-in-from-top-2"
          sideOffset={5}
          align="end"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          <DropdownMenu.Group className="p-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer outline-none"
              >
                <LayoutDashboard
                  size={16}
                  className="mr-3 text-gray-400 group-hover:text-blue-500"
                />
                Dashboard
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors cursor-pointer outline-none"
              >
                <Settings
                  size={16}
                  className="mr-3 text-gray-400 group-hover:text-blue-500"
                />
                Settings
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Group>

          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

          <DropdownMenu.Item
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md cursor-pointer outline-none transition-colors"
            onSelect={handleSignOut}
          >
            <LogOut size={16} className="mr-3" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
