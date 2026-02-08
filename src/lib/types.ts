export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  posts?: { count: number }[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export interface Portfolio {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  problem: string | null;
  solution: string | null;
  tech_stack: string[] | null;
  architecture: string | null;
  result: string | null;
  learnings: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

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
  author_id: string | null;
  author?: Profile | null; // Joined
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
