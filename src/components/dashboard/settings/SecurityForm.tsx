"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function SecurityForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const updates: { email?: string; password?: string } = {};
    if (formData.email) updates.email = formData.email;
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match." });
        setLoading(false);
        return;
      }
      updates.password = formData.password;
    }

    if (Object.keys(updates).length === 0) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Security settings updated successfully! Check your email if you changed it.",
      });
      setFormData({ email: "", password: "", confirmPassword: "" });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
      <div className="col-span-12 sm:col-span-6">
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 block"
        >
          New Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Enter new email"
        />
        <p className="text-xs text-slate-500 mt-1">
          Leave blank to keep current email.
        </p>
      </div>

      <div className="col-span-12 sm:col-span-6">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 block"
        >
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Minimum 6 characters"
        />
      </div>

      <div className="col-span-12 sm:col-span-6">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 block"
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Re-enter new password"
        />
      </div>

      {message && (
        <div className="col-span-12">
          <div
            className={`p-3 rounded-md text-sm ${
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
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Security Settings
        </button>
      </div>
    </form>
  );
}
