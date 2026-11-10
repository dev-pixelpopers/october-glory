"use client";

import React, { useState } from "react";
import {
  Boxes,
  Check,
  Edit,
  Eye,
  Filter,
  Grid,
  List,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  type ProductPayload,
} from "@/lib/api/hooks/catalog";
import type { Product, ProductInstallStep } from "@/lib/api/types";
import { money } from "@/lib/format";
import { buttonGhost, buttonGold, Card, inputClass, StatusBadge } from "../dashboard-shell";
import ImageField from "./image-field";
import VideoField from "./video-field";
import { Modal } from "./service-manager";

const CATEGORIES = ["Wigs", "Bundles", "Closures", "Hair Care", "Accessories"];

/** Shop product CRUD: what /shop lists, its price, image and filter tags. */
export default function ProductManager() {
  const { data: products, isLoading } = useAdminProducts();
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = (products ?? []).filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.texture?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Card
        title="Shop Products"
        action={
          <div className="flex items-center gap-3">
            {/* View Switcher Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#cba660] text-black shadow-sm"
                    : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
                }`}
                title="Grid Card View"
                aria-label="Grid Card View"
              >
                <Grid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#cba660] text-black shadow-sm"
                    : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List size={15} />
              </button>
            </div>

            <button className={buttonGold} onClick={() => setEditing("new")}>
              + New Product
            </button>
          </div>
        }
      >
        {/* Controls Bar: Category Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[null, ...CATEGORIES].map((c) => (
              <button
                key={c ?? "all"}
                onClick={() => setSelectedCategory(c)}
                className={`gotham text-[13px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedCategory === c
                    ? "border-[#cba660] bg-[#cba660]/15 text-[#cda873] font-semibold"
                    : "border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] hover:border-[var(--dash-border-strong)]"
                }`}
              >
                {c ?? "All Products"}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products, textures…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputClass} !py-2 !pl-9 !text-[13px]`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content: Card Grid View or Table View */}
        {isLoading ? (
          <div className="py-16 text-center text-[var(--dash-text-muted)]">
            <p className="gotham text-[14px]">Loading shop products…</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-[var(--dash-text-faint)]">
            <Package size={36} className="mx-auto mb-2 opacity-30 text-[var(--dash-text)]" />
            <p className="gotham text-[14px]">
              {products?.length === 0
                ? "No products added yet. Click '+ New Product' to create one."
                : "No products matching your search filter."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Luxury Card Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const spec = [p.length, p.texture, p.color].filter(Boolean).join(" · ");
              const inStock = (p.stock ?? 1) > 0;

              return (
                <div
                  key={p.id}
                  className={`group flex flex-col rounded-[22px] overflow-hidden bg-[var(--dash-card)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] ${
                    p.is_featured
                      ? "border-[#cba660]/60 shadow-[0_4px_24px_rgba(203,166,96,0.12)] bg-gradient-to-b from-[#cba660]/[0.03] to-[var(--dash-card)]"
                      : "border-[var(--dash-border)] hover:border-[#cba660]/50"
                  }`}
                >
                  {/* Cover Image & Badges */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#1f1f1f]">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                        <Package size={36} className="text-[#cba660]/30" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                      {p.category && (
                        <span className="gotham text-[11px] font-medium tracking-wider uppercase backdrop-blur-md bg-black/60 text-white/90 px-3 py-1 rounded-full border border-white/10 shadow-sm">
                          {p.category}
                        </span>
                      )}

                      {p.is_featured && (
                        <span className="ml-auto flex items-center gap-1.5 gotham text-[11px] font-bold tracking-widest uppercase backdrop-blur-md bg-gradient-to-r from-[#cda873] to-[#e4cc9e] text-black px-3 py-1 rounded-full shadow-lg">
                          <Sparkles size={11} className="fill-black" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Bottom Badges */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span
                        className={`gotham text-[11px] font-medium backdrop-blur-md px-2.5 py-0.5 rounded-full border ${
                          inStock
                            ? "bg-black/65 text-emerald-300 border-emerald-500/30"
                            : "bg-red-950/80 text-red-300 border-red-500/40"
                        }`}
                      >
                        {p.stock !== null && p.stock !== undefined
                          ? inStock
                            ? `${p.stock} in stock`
                            : "Out of stock"
                          : "In stock"}
                      </span>

                      <span
                        className={`ml-auto gotham text-[11px] font-medium backdrop-blur-md px-2 py-0.5 rounded-full border ${
                          p.is_active
                            ? "bg-green-950/70 text-green-300 border-green-500/30"
                            : "bg-black/70 text-gray-400 border-white/10"
                        }`}
                      >
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Title and Specs */}
                    <div className="mb-2">
                      <h4 className="valturin text-[20px] text-[var(--dash-text)] group-hover:text-[#cda873] transition-colors line-clamp-1">
                        {p.name}
                      </h4>
                      {spec && (
                        <p className="gotham text-[12px] text-[var(--dash-text-muted)] mt-1 line-clamp-1">
                          {spec}
                        </p>
                      )}
                    </div>

                    {/* Description preview */}
                    {p.description && (
                      <p className="gotham font-light text-[var(--dash-text-soft)] text-[13px] leading-relaxed line-clamp-2 mb-4">
                        {p.description}
                      </p>
                    )}

                    {/* Price Strip */}
                    <div className="flex items-baseline justify-between gap-2 py-3 border-y border-[var(--dash-border-soft)] mt-auto mb-4">
                      <div>
                        <span className="gotham text-[10px] uppercase tracking-wider text-[var(--dash-text-faint)] block mb-0.5">
                          Price
                        </span>
                        <span className="valturin text-[24px] font-bold text-[#cda873]">
                          {money(p.price)}
                        </span>
                      </div>
                      {(p.the_install?.length ?? 0) > 0 && (
                        <span className="gotham text-[11px] text-[var(--dash-text-muted)]">
                          {p.the_install?.length} install steps
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="flex-1 py-2 px-3 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] text-[var(--dash-text-muted)] hover:text-[#cda873] text-[13px] gotham font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Edit size={14} />
                        <span>Edit Product</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View Matching package-manager.tsx */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--dash-border)]">
                  {["Product", "Category", "Specifications", "Stock", "Price", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest py-3 pr-4"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--dash-border-soft)]">
                {filteredProducts.map((p) => {
                  const spec = [p.length, p.texture, p.color].filter(Boolean).join(" · ");
                  const inStock = (p.stock ?? 1) > 0;

                  return (
                    <tr key={p.id} className="hover:bg-[var(--dash-border-soft)]/30 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="gotham text-[var(--dash-text)] text-[15px] py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[8px] overflow-hidden bg-[var(--dash-border)] shrink-0 border border-white/5">
                            {p.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center andrea text-[18px] text-[var(--dash-text-faint)]">
                                {p.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-[var(--dash-text)] block">
                              {p.name}
                            </span>
                            {p.is_featured && (
                              <span className="inline-flex items-center gap-1 gotham text-[10px] uppercase tracking-wider text-[#cda873] bg-[#cba660]/15 border border-[#cba660]/40 px-2 py-0.2 rounded-full mt-0.5">
                                <Sparkles size={10} />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4 capitalize">
                        {p.category ?? "—"}
                      </td>

                      {/* Specifications */}
                      <td className="gotham text-[var(--dash-text-muted)] text-[13px] pr-4">
                        {spec || "—"}
                      </td>

                      {/* Stock */}
                      <td className="gotham text-[13px] pr-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full border ${
                            inStock
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                              : "bg-red-950/40 text-red-400 border-red-500/30"
                          }`}
                        >
                          {p.stock !== null && p.stock !== undefined
                            ? inStock
                              ? `${p.stock} in stock`
                              : "Out of stock"
                            : "In stock"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="gotham font-bold text-[#cda873] text-[15px] pr-4">
                        {money(p.price)}
                      </td>

                      {/* Status */}
                      <td className="pr-4">
                        <span
                          className={`gotham text-[13px] ${
                            p.is_active ? "text-green-500" : "text-[var(--dash-text-faint)]"
                          }`}
                        >
                          {p.is_active ? "Active" : "Hidden"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditing(p)}
                            className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[#cda873] px-3.5 py-1.5 rounded-full border border-[var(--dash-border)] hover:border-[#cba660] transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <ProductFormModal
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

/* ------------------------------ Form Modal ---------------------------------- */

function ProductFormModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
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
    stock: (product?.stock ?? 10) as number | null | undefined,
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
      stock: form.stock !== null && form.stock !== undefined ? Number(form.stock) : null,
    };
    if (product) update.mutate({ id: product.id, ...payload }, { onSuccess: onClose });
    else create.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal title={product ? `Edit — ${product.name}` : "New Product"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className={inputClass}
            placeholder="Product name"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            required
          />
          <input
            className={inputClass}
            type="number"
            min="0"
            step="0.01"
            placeholder="Price ($)"
            value={form.price}
            onChange={(e) => set({ price: e.target.value })}
            required
          />
          <input
            className={inputClass}
            type="number"
            min="0"
            step="1"
            placeholder="Stock Units"
            value={form.stock ?? ""}
            onChange={(e) =>
              set({ stock: e.target.value === "" ? null : parseInt(e.target.value, 10) })
            }
          />
        </div>

        <select
          className={inputClass}
          value={form.category}
          onChange={(e) => set({ category: e.target.value })}
        >
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          className={inputClass}
          placeholder="Description"
          rows={2}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
        />

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
            <input
              className={inputClass}
              placeholder="Length (22 inch)"
              value={form.length}
              onChange={(e) => set({ length: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Texture (Wavy)"
              value={form.texture}
              onChange={(e) => set({ texture: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Colour"
              value={form.color}
              onChange={(e) => set({ color: e.target.value })}
            />
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
              No install steps added yet. Click &ldquo;Add Step&rdquo; to add install photos with
              tags.
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
          <input
            className={inputClass}
            placeholder="Shop tags (comma separated: wavy, new)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
          <input
            className={inputClass}
            type="number"
            min="0"
            placeholder="Order"
            title="Display order"
            value={form.sort_order}
            onChange={(e) => set({ sort_order: Number(e.target.value) || 0 })}
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set({ is_active: e.target.checked })}
              className="accent-[#cba660] w-5 h-5"
            />
            Show in shop
          </label>
          <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set({ is_featured: e.target.checked })}
              className="accent-[#cba660] w-5 h-5"
            />
            Featured
          </label>
        </div>

        {error && <p className="gotham text-red-400 text-[14px]">{error.message}</p>}
        {product && confirmDelete ? (
          <div className="rounded-[14px] border border-red-500/30 bg-red-500/10 p-4 mt-2">
            <p className="gotham text-[var(--dash-text-soft)] text-[14px] mb-3">
              Permanently delete “{product.name}”? To take it off the shop temporarily, untick “Show
              in shop” instead.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className={buttonGhost}
              >
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
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="gotham text-[13px] text-red-400 hover:text-red-300 cursor-pointer"
              >
                Delete product
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className={buttonGhost}>
                Cancel
              </button>
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
