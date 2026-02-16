// import { Post } from "@/features/blog/types";

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

export interface PostFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  status: "draft" | "published";
  category_ids: string[]; // Many-to-many relationship
  tag_ids: string[]; // Many-to-many relationship
  meta_title?: string;
  meta_description?: string;
}
