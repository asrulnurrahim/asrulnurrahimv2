export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  thumbnail_path: string | null;
  summary: string | null;
  problem: string | null;
  solution: string | null;
  architecture: string | null;
  result: string | null;
  learnings: string | null;
  status: "draft" | "published";
  live_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Technology {
  id: string;
  name: string;
}

export interface ProjectWithTechnologies extends Project {
  technologies: Technology[];
}
