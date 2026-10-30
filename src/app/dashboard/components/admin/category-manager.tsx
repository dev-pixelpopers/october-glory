"use client";

import React, { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/lib/api/hooks/catalog";
import type { ServiceCategory } from "@/lib/api/types";
import { buttonGhost, buttonGold, Card, inputClass } from "../dashboard-shell";
import ImageField from "./image-field";

const KIND_LABEL: Record<ServiceCategory["kind"], string> = {
  services: "Service pages",
  packages: "Package pages",
};

/**
 * Categories — one per page of the website. Service categories group the
 * services on a /services/<slug> page (that page loads them by this slug);
 * package categories group the packages on a package page. Deleting one
 * leaves its services/packages in place (their category simply clears).
 */
export default function CategoryManager() {
  const { data: categories } = useCategories();
  const create = useCreateCategory();
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<ServiceCategory["kind"]>("services");
  const [editing, setEditing] = useState<ServiceCategory | null>(null);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    create.mutate({ name, kind: newKind }, { onSuccess: () => setNewName("") });
  };

  return (
    <Card title="Categories">
      <form onSubmit={add} className="flex flex-wrap gap-3 mb-6">
        <input
          className={`${inputClass} !w-auto flex-1 min-w-[220px]`}
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <select
          className={`${inputClass} !w-auto`}
          value={newKind}
          onChange={(e) => setNewKind(e.target.value as ServiceCategory["kind"])}
        >
          <option value="services">Service page</option>
          <option value="packages">Package page</option>
        </select>
        <button type="submit" disabled={create.isPending || !newName.trim()} className={buttonGold}>
          {create.isPending ? "Adding…" : "Add Category"}
        </button>
      </form>
      {create.error && <p className="gotham text-red-400 text-[14px] mb-3">{create.error.message}</p>}

      {(["services", "packages"] as const).map((kind) => {
        const group = (categories ?? []).filter((c) => c.kind === kind);
        if (group.length === 0) return null;
        return (
          <div key={kind} className="mb-6 last:mb-0">
            <p className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest mb-3">
              {KIND_LABEL[kind]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {group.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setEditing(c)}
                  className="flex items-center gap-3 text-left border border-[var(--dash-border)] rounded-[14px] p-2.5 hover:border-[#cba660]/60 transition-colors cursor-pointer"
                >
                  {/* Sized by the wrapper — the global img rule overrides size utilities on img. */}
                  <div className="w-11 h-11 rounded-[10px] overflow-hidden bg-[var(--dash-border)] shrink-0">
                    {c.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt="" className="object-cover" />
                    )}
                  </div>
                  <span className="min-w-0">
                    <span className="block gotham text-[var(--dash-text)] text-[14px] truncate">{c.name}</span>
                    <span className="block gotham text-[var(--dash-text-faint)] text-[12px] truncate">/{c.slug}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {(categories ?? []).length === 0 && (
        <p className="gotham text-[var(--dash-text-faint)] text-[14px]">No categories yet.</p>
      )}

      {editing && <CategoryEditModal category={editing} onClose={() => setEditing(null)} />}
    </Card>
  );
}

function CategoryEditModal({ category, onClose }: { category: ServiceCategory; onClose: () => void }) {
  const update = useUpdateCategory();
  const del = useDeleteCategory();
  const [name, setName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [image, setImage] = useState(category.image ?? "");
  const [description, setDescription] = useState(category.description ?? "");

  const pending = update.isPending || del.isPending;
  const error = update.error ?? del.error;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(
      { id: category.id, name: name.trim(), description: description.trim() || null, image: image || null },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-6" onClick={onClose}>
      <div
        className="bg-[var(--dash-card)] border border-[#cba660]/30 rounded-[22px] p-8 w-full max-w-[440px] shadow-[0_1vh_4vh_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="gotham font-bold text-[var(--dash-text)] text-[19px]">Edit Category</h3>
          <button onClick={onClose} className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] text-[22px] leading-none cursor-pointer" aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={save} className="flex flex-col gap-4">
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Short description — shown under this category in the site menu"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <ImageField folder="categories" value={image} onChange={setImage} />
          <p className="gotham text-[var(--dash-text-faint)] text-[12px]">
            Page address stays <span className="text-[var(--dash-text-soft)]">/{category.slug}</span> when renamed,
            so the site keeps finding this category&apos;s services.
          </p>
          {error && <p className="gotham text-red-400 text-[14px]">{error.message}</p>}

          {confirmDelete ? (
            <div className="rounded-[14px] border border-red-500/30 bg-red-500/10 p-4">
              <p className="gotham text-[var(--dash-text-soft)] text-[14px] mb-3">
                Delete “{category.name}”? Services and packages in it will keep their data but lose this
                category.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setConfirmDelete(false)} className={buttonGhost}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => del.mutate(category.id, { onSuccess: onClose })}
                  className="gotham text-[14px] text-white bg-red-500/80 hover:bg-red-500 px-5 py-2.5 rounded-full cursor-pointer"
                >
                  {del.isPending ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="gotham text-[13px] text-red-400 hover:text-red-300 cursor-pointer"
              >
                Delete category
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className={buttonGhost}>
                  Cancel
                </button>
                <button type="submit" disabled={pending || !name.trim()} className={buttonGold}>
                  {update.isPending ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
