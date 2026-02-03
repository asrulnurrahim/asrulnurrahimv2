import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard - Able Pro",
  description: "Admin Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
