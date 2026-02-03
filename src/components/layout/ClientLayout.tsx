"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
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
    <div className="flex min-h-screen flex-col font-sans antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {!isDashboard && !isAuth && <Navbar />}
      <main className="flex-1 w-full relative">{children}</main>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  );
}
