"use client";

import React, { useRef } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useUploadImage, type UploadFolder } from "@/lib/api/hooks/admin";
import { inputClass } from "../dashboard-shell";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Image picker for dashboard forms: paste a URL (e.g. /images/RodSet-01.webp)
 * or upload a file, which is stored by the API and its URL filled in here.
 * Either way the form saves a plain image URL.
 */
export default function ImageField({
  value,
  onChange,
  folder,
  placeholder = "Image URL, or upload a photo",
  round = false,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  placeholder?: string;
  /** Circular preview, for avatars. */
  round?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage(folder);
  const [sizeError, setSizeError] = React.useState<string | null>(null);

  const pick = (file: File | undefined) => {
    setSizeError(null);
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setSizeError("That image is over 5 MB. Please choose a smaller one.");
      return;
    }
    upload.mutate(file, { onSuccess: (url) => onChange(url) });
  };

  const error = sizeError ?? upload.error?.message ?? null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 items-center">
        {/* Sized by the wrapper — the global img rule overrides size utilities on img. */}
        <div
          className={`w-11 h-11 overflow-hidden shrink-0 bg-[var(--dash-border)] flex items-center justify-center ${
            round ? "rounded-full" : "rounded-[10px]"
          }`}
        >
          {upload.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-[var(--dash-text-faint)]" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="object-cover object-top" />
          ) : (
            <ImagePlus className="w-5 h-5 text-[var(--dash-text-faint)]" />
          )}
        </div>

        <div className="relative flex-1">
          <input
            className={`${inputClass} pr-10`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-faint)] hover:text-[var(--dash-text)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={upload.isPending}
          className="gotham text-[14px] text-[#cda873] border border-[#cba660]/50 hover:bg-[#cba660]/10 px-4 py-3 rounded-full whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
        >
          {upload.isPending ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            // Let the same file be chosen again after removing it.
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="gotham text-red-400 text-[13px]">{error}</p>}
    </div>
  );
}
