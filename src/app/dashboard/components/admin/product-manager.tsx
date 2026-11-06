"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  type ProductPayload,
} from "@/lib/api/hooks/catalog";
import type { Product, ProductInstallStep } from "@/lib/api/types";
import { money } from "@/lib/format";
import { buttonGhost, buttonGold, Card, inputClass } from "../dashboard-shell";
import ImageField from "./image-field";
import VideoField from "./video-field";
import { Modal } from "./service-manager";

const CATEGORIES = ["Wigs", "Bundles", "Closures", "Hair Care", "Accessories"];

/** Shop product CRUD: what /shop lists, its price, image and filter tags. */
export default function ProductManager() {
  const { data: products } = useAdminProducts();
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  return (
    <>
      <Card
        title="Shop Products"
        action={
          <button className={buttonGold} onClick={() => setEditing("new")}>
            + New Product
          </button>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {(products ?? []).map((p) => (
            <button
              key={p.id}
              onClick={() => setEditing(p)}
              className="text-left border border-[var(--dash-border)] rounded-[16px] p-2.5 hover:border-[#cba660]/60 transition-colors cursor-pointer"
            >
              <div className="aspect-square rounded-[10px] overflow-hidden bg-[#a8683f]/40">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center andrea text-[28px] text-[var(--dash-text-faint)]">
                    {p.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-2 mt-3 px-1">
                <p className="gotham font-bold text-[var(--dash-text)] text-[14px] uppercase tracking-wider truncate">
                  {p.name}
                </p>
                <p className="gotham font-bold text-[#cda873] text-[15px]">{money(p.price)}</p>
              </div>
              <p className={`gotham text-[12px] px-1 mt-1 ${p.is_active ? "text-green-500" : "text-[var(--dash-text-faint)]"}`}>
                {p.is_active ? "Active" : "Hidden"}
                {p.category && <span className="text-[var(--dash-text-faint)]"> · {p.category}</span>}
                {p.is_featured && <span className="text-[#cda873]"> · Featured</span>}
              </p>
            </button>
          ))}
          {(products ?? []).length === 0 && (
            <p className="col-span-full gotham text-[var(--dash-text-faint)] text-[14px] py-8 text-center">
              No products yet.
            </p>
          )}
        </div>
      </Card>

      {editing && (
        <ProductFormModal product={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}

function ProductFormModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const del = useDeleteProduct();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    category: product?.category ?? "Wigs",
    description: product?.description ?? "",
    image: product?.image ?? "",
    background_image: product?.background_image ?? "",
    price: product?.price ?? "",
    length: product?.length ?? "",
    texture: product?.texture ?? "",
    color: product?.color ?? "",
    what_she_wanted: product?.what_she_wanted ?? "",
    what_we_built: product?.what_we_built ?? "",
    how_she_wears_it: product?.how_she_wears_it ?? "",
    video: product?.video ?? "",
    sort_order: product?.sort_order ?? 0,
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
  });
  const [installSteps, setInstallSteps] = useState<ProductInstallStep[]>(
    product?.the_install?.length
      ? product.the_install.map((item) => ({ image: item.image ?? "", tag: item.tag ?? "" }))
      : []
  );
  const [tagsText, setTagsText] = useState((product?.tags ?? []).join(", "));

  const pending = create.isPending || update.isPending || del.isPending;
  const error = create.error ?? update.error ?? del.error;
  const set = (patch: Partial<typeof form>) => setForm({ ...form, ...patch });

  const addInstallStep = () => {
    setInstallSteps((steps) => [...steps, { image: "", tag: "" }]);
  };

  const updateInstallStep = (index: number, patch: Partial<ProductInstallStep>) => {
    setInstallSteps((steps) =>
      steps.map((step, i) => (i === index ? { ...step, ...patch } : step))
    );
  };

  const removeInstallStep = (index: number) => {
    setInstallSteps((steps) => steps.filter((_, i) => i !== index));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInstall = installSteps
      .map((s) => ({ image: s.image.trim(), tag: s.tag.trim() }))
      .filter((s) => s.image !== "" || s.tag !== "");

    const payload: ProductPayload = {
      ...form,
      category: form.category || null,
      description: form.description || null,
      image: form.image || null,
      background_image: form.background_image || null,
      // The card image leads the gallery; extra gallery shots are kept.
      gallery: form.image
        ? [form.image, ...(product?.gallery ?? []).filter((g) => g !== form.image)]
        : product?.gallery ?? [],
      length: form.length || null,
      texture: form.texture || null,
      color: form.color || null,
      tags: tagsText.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      what_she_wanted: form.what_she_wanted || null,
      what_we_built: form.what_we_built || null,
      how_she_wears_it: form.how_she_wears_it || null,
      video: form.video || null,
      the_install: cleanInstall,
    };
    if (product) update.mutate({ id: product.id, ...payload }, { onSuccess: onClose });
    else create.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal title={product ? `Edit — ${product.name}` : "New Product"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input className={inputClass} placeholder="Product name" value={form.name}
            onChange={(e) => set({ name: e.target.value })} required />
          <input className={inputClass} type="number" min="0" step="0.01" placeholder="Price"
            value={form.price} onChange={(e) => set({ price: e.target.value })} required />
        </div>
        <select className={inputClass} value={form.category} onChange={(e) => set({ category: e.target.value })}>
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea className={inputClass} placeholder="Description" rows={2} value={form.description}
          onChange={(e) => set({ description: e.target.value })} />

        <div>
          <label className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-1.5 font-medium">
            Main Product Image
          </label>
          <ImageField
            folder="products"
            value={form.image}
            onChange={(image) => set({ image })}
            placeholder="Image URL (e.g. /images/Tiffany.png), or upload"
          />
        </div>

        {form.category === "Wigs" && (
          <div className="grid grid-cols-3 gap-4">
            <input className={inputClass} placeholder="Length (22 inch)" value={form.length}
              onChange={(e) => set({ length: e.target.value })} />
            <input className={inputClass} placeholder="Texture (Wavy)" value={form.texture}
              onChange={(e) => set({ texture: e.target.value })} />
            <input className={inputClass} placeholder="Colour" value={form.color}
              onChange={(e) => set({ color: e.target.value })} />
          </div>
        )}

        {/* Showcase Narrative */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[var(--dash-border)]">
          <span className="gotham text-[var(--dash-text-soft)] text-[14px] font-bold">
            Showcase Narrative
          </span>
          <div>
            <label className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-1.5 font-medium">
              What She Wanted
            </label>
            <textarea
              className={inputClass}
              placeholder="Client's aesthetic goals, desired look, or consultation notes"
              rows={2}
              value={form.what_she_wanted}
              onChange={(e) => set({ what_she_wanted: e.target.value })}
            />
          </div>
          <div>
            <label className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-1.5 font-medium">
              What We Built
            </label>
            <textarea
              className={inputClass}
              placeholder="Custom build details, cap construction, lace customization, hair specs"
              rows={2}
              value={form.what_we_built}
              onChange={(e) => set({ what_we_built: e.target.value })}
            />
          </div>
          <div>
            <label className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-1.5 font-medium">
              How She Wears It
            </label>
            <textarea
              className={inputClass}
              placeholder="Everyday styling, part transitions, maintenance routines, or versatile looks"
              rows={2}
              value={form.how_she_wears_it}
              onChange={(e) => set({ how_she_wears_it: e.target.value })}
            />
          </div>
        </div>

        {/* Showcase Media */}
        <div className="flex flex-col gap-3 pt-2 border-t border-[var(--dash-border)]">
          <span className="gotham text-[var(--dash-text-soft)] text-[14px] font-bold">
            Showcase Media
          </span>
          <div>
            <label className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-1.5 font-medium">
              Background Image
            </label>
            <ImageField
              folder="products"
              value={form.background_image}
              onChange={(background_image) => set({ background_image })}
              placeholder="Background image URL (e.g. /images/bg.jpg), or upload"
            />
          </div>
          <div>
            <label className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-1.5 font-medium">
              Showcase Video
            </label>
            <VideoField
              folder="products"
              value={form.video}
              onChange={(video) => set({ video })}
              placeholder="Video URL (e.g. /videos/showcase.mp4), or upload"
            />
          </div>
        </div>

        {/* The Install Steps */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--dash-border)]">
          <div className="flex items-center justify-between">
            <span className="gotham text-[var(--dash-text-soft)] text-[14px] font-bold">
              The Install Steps
            </span>
            <button
              type="button"
              onClick={addInstallStep}
              className="gotham text-[13px] text-[#cda873] hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add Step
            </button>
          </div>
          {installSteps.length === 0 && (
            <p className="gotham text-[var(--dash-text-faint)] text-[13px] italic">
              No install steps added yet. Click &ldquo;Add Step&rdquo; to add install photos with tags.
            </p>
          )}
          <div className="flex flex-col gap-3 mt-1">
            {installSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2.5 p-3 rounded-[12px] border border-[var(--dash-border)] bg-[var(--dash-border)]/20"
              >
                <div className="flex items-center justify-between">
                  <span className="gotham text-[12px] uppercase tracking-wider text-[var(--dash-text-faint)] font-medium">
                    Step {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInstallStep(idx)}
                    className="text-[var(--dash-text-muted)] hover:text-red-400 p-1 cursor-pointer transition-colors"
                    title="Remove step"
                    aria-label="Remove step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <ImageField
                  folder="products"
                  value={step.image}
                  onChange={(image) => updateInstallStep(idx, { image })}
                  placeholder={`Step ${idx + 1} Image URL, or upload`}
                />
                <input
                  className={inputClass}
                  placeholder={`Step ${idx + 1} Tag (e.g. Cornrows, Bleaching, Melted)`}
                  value={step.tag}
                  onChange={(e) => updateInstallStep(idx, { tag: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-4 pt-2 border-t border-[var(--dash-border)]">
          <input className={inputClass} placeholder="Shop tags (comma separated: wavy, new)" value={tagsText}
            onChange={(e) => setTagsText(e.target.value)} />
          <input className={inputClass} type="number" min="0" placeholder="Order" title="Display order"
            value={form.sort_order} onChange={(e) => set({ sort_order: Number(e.target.value) || 0 })} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
            <input type="checkbox" checked={form.is_active}
              onChange={(e) => set({ is_active: e.target.checked })} className="accent-[#cba660] w-5 h-5" />
            Show in shop
          </label>
          <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={(e) => set({ is_featured: e.target.checked })} className="accent-[#cba660] w-5 h-5" />
            Featured
          </label>
        </div>

        {error && <p className="gotham text-red-400 text-[14px]">{error.message}</p>}
        {product && confirmDelete ? (
          <div className="rounded-[14px] border border-red-500/30 bg-red-500/10 p-4 mt-2">
            <p className="gotham text-[var(--dash-text-soft)] text-[14px] mb-3">
              Permanently delete “{product.name}”? To take it off the shop temporarily, untick “Show in shop” instead.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmDelete(false)} className={buttonGhost}>
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => del.mutate(product.id, { onSuccess: onClose })}
                className="gotham text-[14px] text-white bg-red-500/80 hover:bg-red-500 px-5 py-2.5 rounded-full cursor-pointer"
              >
                {del.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-3 mt-2">
            {product ? (
              <button type="button" onClick={() => setConfirmDelete(true)}
                className="gotham text-[13px] text-red-400 hover:text-red-300 cursor-pointer">
                Delete product
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className={buttonGhost}>Cancel</button>
              <button type="submit" disabled={pending} className={buttonGold}>
                {create.isPending || update.isPending ? "Saving…" : "Save Product"}
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
