# Project Rules & Architecture Constraints

This document outlines the critical rules and safety constraints for the application. These are **HARD CONSTRAINTS** to ensure stability, performance, and avoid compilation issues.

## General Development Rules

1. **Package Manager**: Always use `pnpm` for installing dependencies and running scripts. Do not use `npm` or `yarn`.

## Runtime Safety (Next.js 16 App Router)

### 1. Boundary Files Must Be Pure (No Supabase)

Files such as `not-found.tsx`, `error.tsx`, and `global-error.tsx` act as the "catch-all" execution points when something goes wrong.

**Why?**

- **Infinite Loops**: If `not-found` triggers Supabase auth (e.g., to check if a user is logged in), and that auth check fails or returns a 404, it re-triggers `not-found`. This creates an infinite recursion loop that crashes the server and dev environment.
- **Compilation Locking**: In development, importing server-heavy libraries (like Supabase or database clients) in boundary files can trigger full webpack recompilation on every 404 hit, locking the terminal.
- **Stability**: Boundary files are the last line of defense. They must be static, synchronous, and fail-safe.

> **Constraint**: Boundary files MUST be pure UI components. NO `createClient`, NO `cookies()`, NO `await`, NO side effects.

### 2. Authentication Is Not Global

Middleware authentication logic is scoped **strictly** to protected routes (e.g., `/dashboard`, `/admin`) and is **NOT** applied globally to every request.

**Why?**

- **Performance**: Running auth checks on static assets (images, fonts), public pages (landing, blog), or health checks introduces unnecessary latency.
- **Edge limitations**: Middleware runs on the Edge runtime. Heavy auth logic or large dependencies can exceed execution limits.
- **Next.js App Router Compatibility**: Global middleware often conflicts with Static Site Generation (SSG). Scoping it ensures public pages remain purely static and cacheable.

> **Constraint**: Auth middleware must use `matcher` to target ONLY protected paths. Public paths must bypass middleware logic entirely.

### 3. Proxy Usage (Next.js 16)

The project uses a proxy pattern (often via a lightweight `middleware.ts` or dedicated proxy config) instead of monolithic middleware.

**Why?**

- **Next.js 16 Deprecations**: Older patterns of modifying requests/responses in deep middleware chains are becoming unstable or deprecated.
- **Standardization**: A proxy ensures that headers, cookies, and CORS are handled uniformly before reaching the application logic.
- **Separation of Concerns**: It separates the "routing/traffic" layer from the "business logic/auth" layer, making the system easier to debug and test.

> **Constraint**: Keep the middleware/proxy layer minimal. Do not add feature flags or business logic here. It should only handle routing security and session token propagation.

### 4. Dashboard & Loading Safety Contracts (LOCKED)

These rules are strict project contracts to ensure `dashboard` pages never trigger compiling loops.

**❌ Dashboard Page Prohibitions (`app/dashboard/page.tsx`)**

1.  **NO `supabase.auth.getUser()`**: Do not manually check auth in the page. Trust the middleware.
2.  **NO `cookies().set`**: Never mutate cookies during rendering.
3.  **NO Manual Redirects**: Do not use `redirect()` inside the component logic significantly; let middleware handle protection.
4.  **NO Client-Side Initial Fetching**: Initial data must be fetched server-side using `createServerClient`.

**❌ Loading Component Prohibitions (`loading.tsx`)**

1.  **NO Data Fetching**: Loading states must be pure UI.
2.  **NO Supabase Imports**: Do not import Supabase in `loading.tsx`.
3.  **NO Logic**: Strictly visual skeletons only.

### 5. Middleware Entry Point (`proxy.ts`)

In this specific Next.js 16 (Turbopack) environment configuration, the middleware entry point is **natively recognized via `proxy.ts`**, NOT `middleware.ts`.

**Why?**

- **Conflict Avoidance**: Adding `src/middleware.ts` causes a build error (`Error: Both middleware file... and proxy file... are detected`).
- **Project Convention**: `src/proxy.ts` is the single source of truth for edge middleware logic.

> **Constraint**: DO NOT create `src/middleware.ts`. Always place middleware logic in `src/proxy.ts`. This file IS the active middleware.
