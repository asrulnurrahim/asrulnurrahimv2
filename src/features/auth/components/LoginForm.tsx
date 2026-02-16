"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validation";

export function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-main relative min-h-screen w-full">
      <div className="auth-wrapper v1 flex h-full min-h-screen w-full items-center">
        <div className="auth-form relative flex min-h-screen grow flex-col items-center justify-center bg-[url('/assets/images/authentication/img-auth-bg.jpg')] bg-cover p-6 dark:bg-[#131920] dark:bg-none">
          <div className="card w-full max-w-[480px] rounded-lg bg-white shadow-none sm:my-12 dark:bg-[#1b232d]">
            <div className="card-body p-10">
              <div className="text-center">
                <Link href="/" className="mb-4 inline-block">
                  <div className="relative mx-auto h-12 w-12">
                    <Image
                      src="/asrul.jpg"
                      alt="Logo"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </Link>
                <div className="my-4 grid gap-2">
                  {/* <button
                    type="button"
                    className="btn hover:border-primary-500 dark:hover:border-primary-500 mt-2 flex w-full items-center justify-center gap-2 rounded border border-[#e7eaee] bg-[#f8f9fa] px-4 py-2.5 text-[#131920] transition-colors dark:border-[#303f50] dark:bg-[#131920] dark:text-[#bfbfbf]"
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
                    className="btn hover:border-primary-500 dark:hover:border-primary-500 mt-2 flex w-full items-center justify-center gap-2 rounded border border-[#e7eaee] bg-[#f8f9fa] px-4 py-2.5 text-[#131920] transition-colors dark:border-[#303f50] dark:bg-[#131920] dark:text-[#bfbfbf]"
                  >
                    <Image
                      src="/assets/images/authentication/twitter.svg"
                      alt="img"
                      width={16}
                      height={16}
                    />{" "}
                    <span> Sign In with Twitter</span>
                  </button> */}
                  <button
                    type="button"
                    onClick={() => handleLogin("google")}
                    className="btn hover:border-primary-500 dark:hover:border-primary-500 mt-2 flex w-full items-center justify-center gap-2 rounded border border-[#e7eaee] bg-[#f8f9fa] px-4 py-2.5 text-[#131920] transition-colors dark:border-[#303f50] dark:bg-[#131920] dark:text-[#bfbfbf]"
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
                    className="btn mt-2 flex w-full items-center justify-center gap-2 rounded border border-[#24292f] bg-[#24292f] px-4 py-2.5 text-white transition-colors hover:bg-[#24292f]/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
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
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full border-t border-[#e7eaee] dark:border-[#303f50]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-slate-500 dark:bg-[#1b232d]">
                    OR
                  </span>
                </div>
              </div>

              <h4 className="mb-4 text-center text-xl font-medium text-[#1d2630] dark:text-white/80">
                Login with your email
              </h4>

              {(error || message) && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-500 dark:border-red-800 dark:bg-red-900/10">
                  {error || message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <input
                    type="email"
                    {...register("email")}
                    className={`form-control m-0 block w-full rounded border bg-white bg-clip-padding px-3 py-2 text-base font-normal text-slate-700 transition ease-in-out focus:bg-white focus:text-slate-700 focus:outline-none dark:bg-[#263240] dark:text-slate-200 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-300 focus:border-blue-600 dark:border-[#303f50]"
                    }`}
                    id="floatingInput"
                    placeholder="Email Address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    {...register("password")}
                    className={`form-control m-0 block w-full rounded border bg-white bg-clip-padding px-3 py-2 text-base font-normal text-slate-700 transition ease-in-out focus:bg-white focus:text-slate-700 focus:outline-none dark:bg-[#263240] dark:text-slate-200 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-300 focus:border-blue-600 dark:border-[#303f50]"
                    }`}
                    id="floatingInput1"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <div className="form-check flex items-center">
                    <input
                      className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer rounded-sm border border-slate-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                      type="checkbox"
                      id="customCheckc1"
                      defaultChecked
                    />
                    <label
                      className="form-check-label inline-block text-sm text-slate-500 dark:text-slate-400"
                      htmlFor="customCheckc1"
                    >
                      Remember me?
                    </label>
                  </div>
                  <h6 className="mb-0 cursor-pointer text-sm font-normal text-blue-500 hover:underline">
                    Forgot Password?
                  </h6>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </div>
              </form>

              <div className="mt-4 flex flex-wrap items-end justify-between text-sm">
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
