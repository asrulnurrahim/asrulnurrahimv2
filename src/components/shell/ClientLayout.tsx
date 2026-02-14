"use client";

import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname?.startsWith("/login");

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
      {!isDashboard && !isAuth && <Navbar />}
      <main className="relative w-full flex-1">{children}</main>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  );
}
