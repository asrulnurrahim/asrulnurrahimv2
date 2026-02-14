import React from "react";
import Image from "next/image";
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
  const [profile, setProfile] = React.useState<{
    full_name: string | null;
    avatar_url: string | null;
  } | null>(null);

  React.useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    };
    getProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect to login after sign out
    router.refresh(); // Refresh to clear any cache
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-[74px] border-b border-slate-200 bg-white transition-all duration-300 lg:left-[280px] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative hidden items-center md:flex">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ctrl + K"
              className="w-[200px] rounded-md border-none bg-slate-100 py-2 pr-4 pl-9 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
            <Sun className="hidden h-5 w-5 dark:block" />
            <Moon className="block h-5 w-5 dark:hidden" />
          </button>

          <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="mx-2 h-6 border-l border-gray-200 dark:border-gray-700"></div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex cursor-pointer items-center gap-3 rounded-full p-1.5 transition-colors outline-none hover:bg-gray-100 lg:rounded-lg dark:hover:bg-gray-800">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">
                      {profile?.full_name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {profile?.full_name || "User"}
                  </p>
                </div>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="animate-in fade-in zoom-in-95 slide-in-from-top-2 z-50 mr-4 min-w-[180px] rounded-md border border-gray-200 bg-white p-1 shadow-lg duration-200 dark:border-gray-800 dark:bg-slate-900"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Label className="mb-1 border-b border-gray-100 px-2 py-1.5 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">
                  My Account
                </DropdownMenu.Label>
                <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 outline-none hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="mt-1 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onSelect={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
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
