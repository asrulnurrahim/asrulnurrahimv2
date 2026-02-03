"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Facebook, Twitter, Chrome } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "twitter",
  ) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/images/authentication/img-auth-bg.jpg')",
        }}
      />
      {/* Overlay/Gradient if needed, legacy has it simple. */}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-[480px] rounded-xl bg-white dark:bg-slate-900 p-10 shadow-2xl dark:shadow-slate-800/50 border border-transparent dark:border-slate-800">
          <div className="flex items-center gap-2 mb-10 justify-center">
            <a className="flex items-center gap-2" href="/">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[rgb(50,66,74)] via-[rgb(69,134,255)] to-[rgb(1,236,213)] bg-size-[300%_100%] animate-[move-bg_20s_linear_infinite]">
                Asrul Nur Rahim
              </span>
            </a>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
              v1.0.0
            </span>
          </div>

          <div className="grid gap-4 mb-8">
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-3 w-full py-2.5 px-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Image
                src="/assets/images/authentication/google.svg"
                alt="Google"
                width={18}
                height={18}
              />
              <span className="font-medium text-sm">Sign In with Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-sm text-slate-500 uppercase">
              OR
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <h4 className="text-center font-medium text-slate-900 dark:text-slate-100 mb-6">
                Login with your email
              </h4>
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Remember me?
                </span>
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-base">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Don't have an Account?
            </span>
            <Link
              href="#"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-500 font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
