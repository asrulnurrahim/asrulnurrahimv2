"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

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

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    headline: profile?.headline || "",
    bio: profile?.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        headline: formData.headline,
        bio: formData.bio,
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
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
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
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Your full name"
        />
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
          value={formData.headline}
          onChange={(e) =>
            setFormData({ ...formData, headline: e.target.value })
          }
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Software Engineer, Designer..."
        />
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
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="flex min-h-[100px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Tell us a little about yourself"
        />
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
