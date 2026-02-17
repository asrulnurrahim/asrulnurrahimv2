export interface DashboardRecentPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  views: number;
  published_at: string | null;
  categories: { name: string; color?: string }[];
}

export interface DashboardStats {
  counts: {
    posts: number;
    projects: number;
    categories: number;
    views: number;
  };
  recentPosts: DashboardRecentPost[];
}
