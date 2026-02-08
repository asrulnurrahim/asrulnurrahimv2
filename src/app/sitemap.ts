import { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/services/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static routes
  const routes = ["", "/about", "/blog", "/projects"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Fetch posts
  const posts = await getPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Fetch projects
  const projects = await getProjects();
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at || project.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...routes, ...postRoutes, ...projectRoutes];
}
