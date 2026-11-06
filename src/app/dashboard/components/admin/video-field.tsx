"use client";

import React, { useRef } from "react";
import { Film, Loader2, X } from "lucide-react";
import { useUploadVideo, type UploadFolder } from "@/lib/api/hooks/admin";
import { inputClass } from "../dashboard-shell";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

/**
 * Video picker for dashboard forms: paste a URL (e.g. /videos/showcase.mp4)
 * or upload a video file, which is stored by the API and its URL filled in here.
 * Either way the form saves a plain video URL.
 */
export default function VideoField({
  value,
  onChange,
  folder = "products",
  placeholder = "Video URL (e.g. /videos/showcase.mp4), or upload",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = useUploadVideo(folder);
  const [sizeError, setSizeError] = React.useState<string | null>(null);

  const pick = (file: File | undefined) => {
    setSizeError(null);
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setSizeError("That video is over 50 MB. Please choose a smaller one.");
      return;
    }
    upload.mutate(file, { onSuccess: (url) => onChange(url) });
  };

  const error = sizeError ?? upload.error?.message ?? null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 items-center">
        <div className="w-11 h-11 overflow-hidden shrink-0 bg-[var(--dash-border)] rounded-[10px] flex items-center justify-center relative">
          {upload.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-[var(--dash-text-faint)]" />
          ) : value ? (
            <video src={value} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <Film className="w-5 h-5 text-[var(--dash-text-faint)]" />
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
              aria-label="Remove video"
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
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="gotham text-red-400 text-[13px]">{error}</p>}
    </div>
  );
}
