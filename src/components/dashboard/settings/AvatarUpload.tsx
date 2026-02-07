"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2, Upload, Camera, X, Check } from "lucide-react";
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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
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

  const onCropComplete = useCallback((item: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
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
    } catch (error: any) {
      alert("Error updating avatar: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-4xl text-slate-400">?</span>
            </div>
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
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
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg dark:bg-slate-900 dark:border-slate-800">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Crop Profile Picture
              </Dialog.Title>
            </div>

            <div className="relative h-64 w-full bg-slate-100 rounded-md overflow-hidden">
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
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Zoom
              </label>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
              >
                <Slider.Track className="bg-slate-200 dark:bg-slate-700 relative grow rounded-full h-[3px]">
                  <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-5 h-5 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Zoom"
                />
              </Slider.Root>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
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
