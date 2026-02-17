import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("envSchema", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Set valid defaults so the module import doesn't fail
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-anon-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("validates valid environment variables", async () => {
    const { clientEnvSchema } = await import("./env/client");
    const validEnv = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
      NEXT_PUBLIC_SITE_URL: "https://example.com",
      NEXT_PUBLIC_TINYMCE_API_KEY: "tinymce-key",
    };
    const result = clientEnvSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("validates required fields", async () => {
    const { clientEnvSchema } = await import("./env/client");
    const invalidEnv = {
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    };
    const result = clientEnvSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues;
      expect(
        issues.some((i) => i.path.includes("NEXT_PUBLIC_SUPABASE_URL")),
      ).toBe(true);
    }
  });

  it("validates url format", async () => {
    const { clientEnvSchema } = await import("./env/client");
    const invalidEnv = {
      NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    };
    const result = clientEnvSchema.safeParse(invalidEnv);
    expect(result.success).toBe(false);
  });

  it("allows undefined site url", async () => {
    const { clientEnvSchema } = await import("./env/client");
    const validEnv = {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-anon-key",
    };
    const result = clientEnvSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NEXT_PUBLIC_SITE_URL).toBeUndefined();
    }
  });

  it("uses VERCEL_URL as fallback", async () => {
    vi.resetModules();
    process.env = { ...process.env };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-anon-key";
    process.env.NEXT_PUBLIC_VERCEL_URL = "my-deployment.vercel.app";
    delete process.env.NEXT_PUBLIC_SITE_URL;

    // Re-import to trigger execution of the parsing logic
    const { env } = await import("./env/client");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://my-deployment.vercel.app");
  });
});
