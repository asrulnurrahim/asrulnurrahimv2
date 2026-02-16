import { NextResponse } from "next/server";
import { getDashboardPosts } from "@/features/blog/services";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const query = searchParams.get("query") || "";
    const sort = searchParams.get("sort") || "created_at";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";
    const status =
      (searchParams.get("status") as "draft" | "published" | "all") || "all";

    const result = await getDashboardPosts({
      page,
      limit,
      query,
      sort,
      order,
      status,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching dashboard posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard posts" },
      { status: 500 },
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 },
      );
    }

    // We can use the service deletePost instead of raw supabase calls if available,
    // but assuming we need to delete via service or direct DB.
    // Let's use the service if it handles SB client creation safely for route handlers.
    // Checking services/posts.ts, deletePost uses 'createClient' from lib/supabase/client?
    // No, services usually use server client. Let's check imports in services/posts.ts
    // It imports createClient from "@/lib/supabase/client" in the file I viewed?
    // Wait, let me check services/posts.ts again.
    // It imports createClient from "@/lib/supabase/server" (line 1).
    // So we can use deletePost from services safely here.

    const { deletePost } = await import("@/features/blog/services");
    await deletePost(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
