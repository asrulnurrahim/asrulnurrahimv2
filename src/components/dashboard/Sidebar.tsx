"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  Lock,
  Power,
  User,
  Grid,
  LayoutDashboard,
} from "lucide-react";

export function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={`fixed top-0 left-0 h-screen w-[280px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="h-full flex flex-col">
        {/* Header / Logo */}
        <div className="flex items-center px-6 py-4 h-[74px] border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] animate-[move-bg_20s_linear_infinite]">
                Asrul Nur Rahim
              </span>
            </Link>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              v1.0.0
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <img
                  src="/me-2.webp"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h6 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  Asrul Nur Rahim
                </h6>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Administrator
                </p>
              </div>
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2 px-4">
            Navigation
          </div>

          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6 px-4">
            Management
          </div>
          <NavItem
            href="/dashboard/profile"
            icon={<User className="w-5 h-5" />}
            label="Profile"
            isActive={pathname === "/dashboard/profile"}
          />
          <NavItem
            href="/dashboard/settings"
            icon={<Settings className="w-5 h-5" />}
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
