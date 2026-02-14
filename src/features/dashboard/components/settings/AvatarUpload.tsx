"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2, Camera } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";

interface AvatarUploadProps {
  user: User;
  url: string | null;
  onUploadComplete: (url: string) => void;
}

export default function AvatarUpload({
  user,
  url,
  onUploadComplete,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setIsModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback(
    (
      _item: unknown,
      croppedAreaPixels: {
        width: number;
        height: number;
        x: number;
        y: number;
      },
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number },
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setUploading(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      if (!croppedImage) {
        throw new Error("Could not crop image");
      }

      const fileExt = "jpg";
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, croppedImage);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicData.publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicData.publicUrl);
      onUploadComplete(publicData.publicUrl);
      setIsModalOpen(false);
      setImageSrc(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error updating avatar: " + error.message);
      } else {
        alert("Error updating avatar: Unknown error");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="group relative">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-slate-800">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700">
              <span className="text-4xl text-slate-400">?</span>
            </div>
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-md transition-colors hover:bg-blue-700"
        >
          <Camera size={16} />
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-sm text-slate-500">
        Allowed *.jpeg, *.jpg, *.png, *.gif
      </p>

      {/* Cropping Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="animate-in fade-in fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="text-lg leading-none font-semibold tracking-tight">
                Crop Profile Picture
              </Dialog.Title>
            </div>

            <div className="relative h-64 w-full overflow-hidden rounded-md bg-slate-100">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                />
              )}
            </div>

            <div className="py-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Zoom
              </label>
              <Slider.Root
                className="relative flex h-5 w-full touch-none items-center select-none"
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
              >
                <Slider.Track className="relative h-[3px] grow rounded-full bg-slate-200 dark:bg-slate-700">
                  <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
                </Slider.Track>
                <Slider.Thumb
                  className="block h-5 w-5 rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Zoom"
                />
              </Slider.Root>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                disabled={uploading}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Avatar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
