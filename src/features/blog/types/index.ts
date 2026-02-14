export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  posts?: { count: number }[];
  description?: string | null;
  color?: string | null;
}

import { Profile } from "@/features/profile/types";

export interface Post {
  id: string;
  title: string;
  slug: string;
  views: number;
  excerpt: string | null;
  content: string | null;
  thumbnail: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  category_id?: string | null; // Deprecated
  category?: Category | null; // Deprecated
  categories?: Category[]; // Many-to-Many
  tags?: Tag[]; // Many-to-Many
  author_id: string | null;
  author?: Profile | null; // Joined
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DashboardPostsOptions {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
  order?: "asc" | "desc";
}
