import { getPosts } from "@/features/blog/services";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await getPosts();

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Asrul Nur Rahim Blog</title>
    <link>${baseUrl}</link>
    <description>Sharing knowledge about technology, coding, and software engineering.</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(
          post.published_at || post.created_at,
        ).toUTCString()}</pubDate>
        <description><![CDATA[${post.excerpt || ""}]]></description>
        <author>me@asrulnurrahim.com (Asrul Nur Rahim)</author>
        ${
          post.categories && post.categories.length > 0
            ? post.categories
                .map((cat) => `<category><![CDATA[${cat.name}]]></category>`)
                .join("")
            : ""
        }
      </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
