import { Metadata } from "next";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard - Asrul Nur Rahim",
  description: "Admin Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
