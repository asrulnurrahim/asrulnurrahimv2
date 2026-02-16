import { NextRequest, NextResponse } from "next/server";
import { getPaginatedPosts } from "@/features/blog/services/posts";

import { publicPostsSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const result = publicPostsSchema.safeParse(searchParams);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: result.error.format() },
        { status: 400 },
      );
    }

    const { page, limit, search, category, tag } = result.data;

    const posts = await getPaginatedPosts(page, limit, search, category, tag);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
