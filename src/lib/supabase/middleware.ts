import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Explicit list of protected route prefixes.
 * Only these routes will trigger Supabase auth logic.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  // "/admin",
  // "/settings",
];

/**
 * Deterministic protected-route matcher.
 * Prevents false positives like "/dashboard-old".
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Early exit for all non-protected routes
  // This guarantees:
  // - no Supabase calls
  // - no cookie mutation
  // - no infinite compiling on 404 / error routes
  // 1. Early exit for all non-protected routes AND not /login
  // This guarantees:
  // - no Supabase calls (save for login/protected)
  // - no cookie mutation
  // - no infinite compiling on 404 / error routes
  const isLoginPage = path === "/login";
  if (!isProtectedRoute(path) && !isLoginPage) {
    return NextResponse.next({ request });
  }

  // 2. Prepare response only for protected routes or /login
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync cookies back to the request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Re-create response to attach updated cookies
          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Authentication check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Access control
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute(path) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 5. Authenticated request continues
  return supabaseResponse;
}
