import React from "react";
import { Menu, Search, Sun, Moon, Bell, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // Redirect to login after sign out
    router.refresh(); // Refresh to clear any cache
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-[74px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Ctrl + K"
              className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-md text-sm w-[200px] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>

          <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2"></div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-3 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full lg:rounded-lg transition-colors outline-none">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden">
                  <img
                    src="/me-2.webp"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Administrator
                  </p>
                </div>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[180px] bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 p-1 mr-4 z-50 animate-in fade-in zoom-in-95 duration-200 slide-in-from-top-2"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Label className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 mb-1">
                  My Account
                </DropdownMenu.Label>
                <DropdownMenu.Item className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer outline-none mt-1"
                  onSelect={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
