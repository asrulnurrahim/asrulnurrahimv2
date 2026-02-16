"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/lib/validation";

interface ProfileFormProps {
  user: User;
  profile: {
    full_name: string | null;
    headline: string | null;
    bio: string | null;
  } | null;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      headline: profile?.headline || "",
      bio: profile?.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        headline: data.headline,
        bio: data.bio,
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-6">
      <div className="col-span-12 sm:col-span-6">
        <label
          htmlFor="full_name"
          className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          Full Name
        </label>
        <input
          id="full_name"
          type="text"
          {...register("full_name")}
          className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100 ${
            errors.full_name
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700"
          }`}
          placeholder="Your full name"
        />
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div className="col-span-12 sm:col-span-6">
        <label
          htmlFor="headline"
          className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          Headline
        </label>
        <input
          id="headline"
          type="text"
          {...register("headline")}
          className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100 ${
            errors.headline
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700"
          }`}
          placeholder="Software Engineer, Designer..."
        />
        {errors.headline && (
          <p className="mt-1 text-sm text-red-500">{errors.headline.message}</p>
        )}
      </div>

      <div className="col-span-12">
        <label
          htmlFor="bio"
          className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          Bio
        </label>
        <textarea
          id="bio"
          {...register("bio")}
          className={`flex min-h-[100px] w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100 ${
            errors.bio
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-300 dark:border-slate-700"
          }`}
          placeholder="Tell us a little about yourself"
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      {message && (
        <div className="col-span-12">
          <div
            className={`rounded-md p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <div className="col-span-12 text-right">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:focus:ring-offset-slate-900"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Profile
        </button>
      </div>
    </form>
  );
}
