export interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalProjects: number;
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
