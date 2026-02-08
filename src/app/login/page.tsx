"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  const handleLogin = async (provider: "github" | "google") => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-main relative min-h-screen w-full">
      <div className="auth-wrapper v1 flex items-center w-full h-full min-h-screen">
        <div className="auth-form flex items-center justify-center grow flex-col min-h-screen bg-cover relative p-6 bg-[url('/assets/images/authentication/img-auth-bg.jpg')] dark:bg-none dark:bg-[#131920]">
          <div className="card sm:my-12 w-full max-w-[480px] shadow-none bg-white dark:bg-[#1b232d] rounded-lg">
            <div className="card-body p-10">
              <div className="text-center">
                <Link href="/" className="inline-block mb-4">
                  <div className="w-12 h-12 relative mx-auto">
                    <Image
                      src="/asrul.jpg"
                      alt="Logo"
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </Link>
                <div className="grid my-4 gap-2">
                  <button
                    type="button"
                    className="btn mt-2 flex items-center justify-center gap-2 text-[#131920] dark:text-[#bfbfbf] bg-[#f8f9fa] dark:bg-[#131920] border border-[#e7eaee] dark:border-[#303f50] hover:border-primary-500 dark:hover:border-primary-500 py-2.5 px-4 rounded transition-colors w-full"
                  >
                    <Image
                      src="/assets/images/authentication/facebook.svg"
                      alt="img"
                      width={16}
                      height={16}
                    />{" "}
                    <span> Sign In with Facebook</span>
                  </button>
                  <button
                    type="button"
                    className="btn mt-2 flex items-center justify-center gap-2 text-[#131920] dark:text-[#bfbfbf] bg-[#f8f9fa] dark:bg-[#131920] border border-[#e7eaee] dark:border-[#303f50] hover:border-primary-500 dark:hover:border-primary-500 py-2.5 px-4 rounded transition-colors w-full"
                  >
                    <Image
                      src="/assets/images/authentication/twitter.svg"
                      alt="img"
                      width={16}
                      height={16}
                    />{" "}
                    <span> Sign In with Twitter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogin("google")}
                    className="btn mt-2 flex items-center justify-center gap-2 text-[#131920] dark:text-[#bfbfbf] bg-[#f8f9fa] dark:bg-[#131920] border border-[#e7eaee] dark:border-[#303f50] hover:border-primary-500 dark:hover:border-primary-500 py-2.5 px-4 rounded transition-colors w-full"
                  >
                    <Image
                      src="/assets/images/authentication/google.svg"
                      alt="img"
                      width={16}
                      height={16}
                    />{" "}
                    <span> Sign In with Google</span>
                  </button>
                  {/* Keep GitHub as a functional option but styled consistently if desired, or separate */}
                  <button
                    type="button"
                    onClick={() => handleLogin("github")}
                    disabled={loading}
                    className="btn mt-2 flex items-center justify-center gap-2 text-white bg-[#24292f] border border-[#24292f] hover:bg-[#24292f]/90 py-2.5 px-4 rounded transition-colors w-full disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    )}
                    <span> Sign In with GitHub</span>
                  </button>
                </div>
              </div>

              <div className="relative my-5">
                <div
                  aria-hidden="true"
                  className="absolute flex inset-0 items-center"
                >
                  <div className="w-full border-t border-[#e7eaee] dark:border-[#303f50]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-[#1b232d] text-sm text-slate-500">
                    OR
                  </span>
                </div>
              </div>

              <h4 className="text-center font-medium mb-4 text-[#1d2630] dark:text-white/80 text-xl">
                Login with your email
              </h4>

              {(error || message) && (
                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                  {error || message}
                </div>
              )}

              <form onSubmit={handleEmailLogin}>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control block w-full px-3 py-2 text-base font-normal text-slate-700 bg-white bg-clip-padding border border-slate-300 rounded transition ease-in-out m-0 focus:text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none dark:bg-[#263240] dark:border-[#303f50] dark:text-slate-200"
                    id="floatingInput"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control block w-full px-3 py-2 text-base font-normal text-slate-700 bg-white bg-clip-padding border border-slate-300 rounded transition ease-in-out m-0 focus:text-slate-700 focus:bg-white focus:border-blue-600 focus:outline-none dark:bg-[#263240] dark:border-[#303f50] dark:text-slate-200"
                    id="floatingInput1"
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="flex mt-1 justify-between items-center flex-wrap gap-2">
                  <div className="form-check flex items-center">
                    <input
                      className="form-check-input h-4 w-4 border border-slate-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="checkbox"
                      id="customCheckc1"
                      defaultChecked
                    />
                    <label
                      className="form-check-label inline-block text-slate-500 dark:text-slate-400 text-sm"
                      htmlFor="customCheckc1"
                    >
                      Remember me?
                    </label>
                  </div>
                  <h6 className="font-normal text-blue-500 mb-0 text-sm cursor-pointer hover:underline">
                    Forgot Password?
                  </h6>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </div>
              </form>

              <div className="flex justify-between items-end flex-wrap mt-4 text-sm">
                <h6 className="f-w-500 mb-0 text-slate-600 dark:text-slate-400">
                  Don&apos;t have an Account?
                </h6>
                <a href="#" className="text-blue-500 hover:underline">
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
