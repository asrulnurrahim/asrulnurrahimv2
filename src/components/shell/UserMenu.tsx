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
    router.push("/");
    router.refresh();
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="group flex cursor-pointer items-center gap-3 rounded-full p-1.5 transition-colors outline-none hover:bg-slate-100 lg:rounded-lg dark:hover:bg-slate-800">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-300 text-xs font-bold text-slate-500 dark:bg-slate-600">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
          </div>
          <div className="mr-1 hidden text-left xl:block">
            <p className="text-sm leading-tight font-semibold text-slate-900 dark:text-white">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">
              {profile?.headline || "Member"}
            </p>
          </div>
          <div
            className={`hidden text-slate-500 transition-transform duration-200 xl:block dark:text-slate-400 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={16} />
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="animate-in fade-in zoom-in-95 slide-in-from-top-2 z-50 mr-4 min-w-[240px] rounded-lg border border-slate-200 bg-white p-1 shadow-xl duration-200 dark:border-slate-800 dark:bg-slate-900"
          sideOffset={5}
          align="end"
        >
          <div className="mb-1 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {profile?.full_name || "User"}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>

          <DropdownMenu.Group className="p-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/dashboard"
                className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors outline-none hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
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
                className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors outline-none hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
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
            className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors outline-none hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
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
