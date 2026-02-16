export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  thumbnail_url: string | null;
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
