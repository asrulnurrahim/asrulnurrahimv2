import { siteConfig } from "@/lib/site-config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/login/", "/*?*"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
