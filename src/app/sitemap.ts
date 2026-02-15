import { siteConfig } from "@/lib/site-config";
import { MetadataRoute } from "next";
import { getPosts, getCategories } from "@/features/blog/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const routes = ["", "/about", "/blog", "/projects"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic posts
  const posts = await getPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(
      post.updated_at || post.published_at || post.created_at,
    ).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic categories
  const categories = await getCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(category.created_at).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...postRoutes, ...categoryRoutes];
}
