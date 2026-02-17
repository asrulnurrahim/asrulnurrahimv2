import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "../types";

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const res = await fetch("/api/dashboard/stats");
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return res.json();
};

export const useDashboardStats = (initialData: DashboardStats) => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    initialData,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 10000, // Consider data fresh for 10 seconds
  });
};
