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

/**
 * Service categories CRUD. Categories group both services and packages; deleting
 * one leaves its services/packages in place (their category simply clears).
 */
export default function CategoryManager() {
  const { data: categories } = useCategories();
  const create = useCreateCategory();
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<ServiceCategory | null>(null);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    create.mutate(name, { onSuccess: () => setNewName("") });
  };

  return (
    <Card title="Service Categories">
      <form onSubmit={add} className="flex gap-3 mb-5">
        <input
          className={inputClass}
          placeholder="New category name (e.g. Bridal)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" disabled={create.isPending || !newName.trim()} className={buttonGold}>
          {create.isPending ? "Adding…" : "Add Category"}
        </button>
      </form>
      {create.error && <p className="gotham text-red-400 text-[14px] mb-3">{create.error.message}</p>}

      <div className="flex flex-wrap gap-2.5">
        {(categories ?? []).map((c) => (
          <span
            key={c.id}
            className="inline-flex items-center gap-2 gotham text-[var(--dash-text)] text-[14px] px-3.5 py-2 rounded-full border border-[var(--dash-border)] bg-[var(--dash-card-soft)]"
          >
            {c.name}
            <button
              onClick={() => setEditing(c)}
              className="text-[var(--dash-text-muted)] hover:text-[#cda873] cursor-pointer"
              aria-label={`Rename ${c.name}`}
            >
              ✎
            </button>
          </span>
        ))}
        {(categories ?? []).length === 0 && (
          <p className="gotham text-[var(--dash-text-faint)] text-[14px]">No categories yet.</p>
        )}
      </div>

      {editing && <CategoryEditModal category={editing} onClose={() => setEditing(null)} />}
    </Card>
  );
}

function CategoryEditModal({ category, onClose }: { category: ServiceCategory; onClose: () => void }) {
  const update = useUpdateCategory();
  const del = useDeleteCategory();
  const [name, setName] = useState(category.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pending = update.isPending || del.isPending;
  const error = update.error ?? del.error;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate({ id: category.id, name: name.trim() }, { onSuccess: onClose });
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
