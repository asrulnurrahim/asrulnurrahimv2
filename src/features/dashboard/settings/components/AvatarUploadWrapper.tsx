"use client";

import { User } from "@supabase/supabase-js";
import AvatarUpload from "../forms/AvatarUpload";
import { useRouter } from "next/navigation";

interface AvatarUploadWrapperProps {
  user: User;
  url: string | null;
}

export default function AvatarUploadWrapper({
  user,
  url,
}: AvatarUploadWrapperProps) {
  const router = useRouter();

  const handleUploadComplete = () => {
    router.refresh(); // Refresh server components to update avatar across the app
  };

  return (
    <AvatarUpload
      user={user}
      url={url}
      onUploadComplete={handleUploadComplete}
    />
  );
}
