"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import { useSubmitShoutout } from "@/lib/api/hooks/loyalty";
import { inputClass } from "../dashboard-shell";

const PLATFORMS = ["Instagram Story", "Facebook Story", "TikTok", "Other"];
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB — mirrors the API rule

interface FormValues {
  platform: string;
}

/**
 * Screenshot proof submission: drag-and-drop dropzone with live thumbnail
 * preview, platform selector, and a mutation that refetches the claim list
 * so the new claim appears as "Pending Approval" immediately.
 */
export default function ShoutoutSubmissionForm({ bonusPoints }: { bonusPoints: number }) {
  const submit = useSubmitShoutout();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { platform: "Instagram Story" } });

  // Object URLs must be revoked to avoid leaking blobs.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  const acceptFile = useCallback((candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED.includes(candidate.type)) {
      setFileError("Please upload a PNG, JPG or WEBP image.");
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setFileError("That image is over 5 MB — please pick a smaller one.");
      return;
    }
    setFileError(null);
    setFile(candidate);
  }, []);

  const onSubmit = (values: FormValues) => {
    if (!file) {
      setFileError("Add a screenshot of your story first.");
      return;
    }
    submit.mutate(
      { platform: values.platform, file },
      {
        onSuccess: () => {
          setFile(null);
          reset();
          setShowToast(true);
        },
      },
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Dropzone */}
        {!preview ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              acceptFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-[18px] border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer ${
              dragOver
                ? "border-[#cba660] bg-[#cba660]/10"
                : "border-[var(--dash-border)] hover:border-[#cba660]/60"
            }`}
          >
            <ImagePlus size={30} className="text-[#cda873]" />
            <span className="gotham text-[var(--dash-text-soft)] text-[15px]">
              {dragOver ? "Drop it right here!" : "Drag & drop your story screenshot"}
            </span>
            <span className="gotham text-[var(--dash-text-faint)] text-[13px]">
              or click to browse — PNG, JPG, WEBP up to 5 MB
            </span>
            <input
              type="file"
              accept={ACCEPTED.join(",")}
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </label>
        ) : (
          <div className="relative rounded-[18px] overflow-hidden border border-[var(--dash-border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Screenshot preview" className="w-full max-h-[260px] object-contain bg-black/20" />
            <button
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remove image"
              className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X size={17} />
            </button>
            <p className="gotham text-[var(--dash-text-muted)] text-[13px] px-4 py-2.5">
              {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        {fileError && <p className="gotham text-red-400 text-[14px]">{fileError}</p>}

        {/* Platform */}
        <select className={inputClass} {...register("platform", { required: "Pick a platform" })}>
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        {errors.platform && <p className="gotham text-red-400 text-[14px]">{errors.platform.message}</p>}

        {submit.error && <p className="gotham text-red-400 text-[14px]">{submit.error.message}</p>}

        <button
          type="submit"
          disabled={submit.isPending}
          className="self-start bg-[#cba660] hover:bg-[#b8934e] disabled:opacity-50 text-black gotham font-bold text-[15px] px-7 py-3 rounded-full transition-colors cursor-pointer"
        >
          {submit.isPending ? "Uploading…" : `Claim My ${bonusPoints} Points`}
        </button>
      </form>

      {/* Success toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 bg-[var(--dash-card)] border border-green-500/40 rounded-full pl-4 pr-6 py-3.5 shadow-2xl">
          <CheckCircle2 size={20} className="text-green-500" />
          <p className="gotham text-[var(--dash-text)] text-[14px]">
            Shoutout submitted — it&apos;s now <span className="font-bold">Pending Approval</span>.
          </p>
        </div>
      )}
    </>
  );
}
