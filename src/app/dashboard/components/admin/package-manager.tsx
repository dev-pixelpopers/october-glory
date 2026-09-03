"use client";

import React, { useMemo, useState } from "react";
import {
  useCategories,
  useCreatePackage,
  useDeletePackage,
  usePackagePriceHistory,
  usePackages,
  useServices,
  useUpdatePackage,
  type PackagePayload,
} from "@/lib/api/hooks/catalog";
import type { Package } from "@/lib/api/types";
import { durationLabel, money, shortDate } from "@/lib/format";
import { buttonGhost, buttonGold, Card, inputClass } from "../dashboard-shell";
import { Modal } from "./service-manager";

const COLLECTIONS = ["maintenance", "glorious", "bridal"] as const;

/** Package CRUD: bundle services, watch the running total, set one package price. */
export default function PackageManager() {
  const { data: packages } = usePackages();
  const { data: categories } = useCategories();
  const [editing, setEditing] = useState<Package | "new" | null>(null);
  const [historyFor, setHistoryFor] = useState<Package | null>(null);

  return (
    <>
      <Card
        title="Packages"
        action={
          <button className={buttonGold} onClick={() => setEditing("new")}>
            + New Package
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--dash-border)]">
                {["Package", "Collection", "Services", "Total Duration", "Package Price", "Status", ""].map((h) => (
                  <th key={h} className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dash-border-soft)]">
              {(packages ?? []).map((p) => (
                <tr key={p.id}>
                  <td className="gotham text-[var(--dash-text)] text-[15px] py-4 pr-4">
                    {p.name}
                    {p.is_featured && (
                      <span className="ml-2 gotham text-[11px] uppercase tracking-wider text-[#cda873] bg-[#cba660]/15 border border-[#cba660]/40 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4 capitalize">{p.collection ?? "—"}</td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4">{p.services.length}</td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4">{durationLabel(p.duration_minutes)}</td>
                  <td className="gotham font-bold text-[#cda873] text-[15px] pr-4">
                    {money(p.price)}
                    {p.price !== p.services_total && (
                      <span className="gotham font-light text-[var(--dash-text-faint)] text-[12px] ml-2 line-through">
                        {money(p.services_total)}
                      </span>
                    )}
                  </td>
                  <td className="pr-4">
                    <span className={`gotham text-[13px] ${p.is_active ? "text-green-500" : "text-[var(--dash-text-faint)]"}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setHistoryFor(p)}
                        className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[#cda873] px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                      >
                        View Price History
                      </button>
                      <button
                        onClick={() => setEditing(p)}
                        className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(packages ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="gotham text-[var(--dash-text-faint)] text-[14px] py-8 text-center">
                    No packages yet. Create a service first, then bundle services into a package.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <PackageFormModal
          pkg={editing === "new" ? null : editing}
          categories={categories ?? []}
          onClose={() => setEditing(null)}
        />
      )}
      {historyFor && <PackagePriceHistoryModal pkg={historyFor} onClose={() => setHistoryFor(null)} />}
    </>
  );
}

/* ------------------------------ Form modal ---------------------------------- */

function PackageFormModal({
  pkg,
  categories,
  onClose,
}: {
  pkg: Package | null;
  categories: { id: number; name: string }[];
  onClose: () => void;
}) {
  const { data: services } = useServices();
  const create = useCreatePackage();
  const update = useUpdatePackage();
  const del = useDeletePackage();

  const [name, setName] = useState(pkg?.name ?? "");
  const [tagline, setTagline] = useState(pkg?.tagline ?? "");
  const [description, setDescription] = useState(pkg?.description ?? "");
  const [collection, setCollection] = useState<string>(pkg?.collection ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(pkg?.category_id ?? null);
  const [includes, setIncludes] = useState<string[]>(pkg?.includes?.length ? pkg.includes : [""]);
  const [notIncluded, setNotIncluded] = useState(pkg?.not_included ?? "");
  const [bestFor, setBestFor] = useState(pkg?.best_for ?? "");
  const [isFeatured, setIsFeatured] = useState(pkg?.is_featured ?? false);
  const [isActive, setIsActive] = useState(pkg?.is_active ?? true);
  const [selectedIds, setSelectedIds] = useState<number[]>(pkg?.services.map((s) => s.id) ?? []);
  // Blank = "use the suggested total"; a value overrides it.
  const [priceOverride, setPriceOverride] = useState<string>(
    pkg && pkg.price !== pkg.services_total ? pkg.price : "",
  );

  const selectedSet = new Set(selectedIds);
  const selectedServices = (services ?? []).filter((s) => selectedSet.has(s.id));

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0),
    [selectedServices],
  );
  const suggestedTotal = useMemo(
    () => selectedServices.reduce((sum, s) => sum + parseFloat(s.current_price || "0"), 0),
    [selectedServices],
  );

  const pending = create.isPending || update.isPending || del.isPending;
  const error = create.error ?? update.error ?? del.error;

  const toggleService = (id: number) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: PackagePayload = {
      name,
      tagline: tagline || null,
      description: description || null,
      collection: collection || null,
      category_id: categoryId,
      includes: includes.map((b) => b.trim()).filter(Boolean),
      not_included: notIncluded || null,
      best_for: bestFor || null,
      is_featured: isFeatured,
      is_active: isActive,
      service_ids: selectedIds,
      // Send the override when set, otherwise let the backend use the sum.
      price: priceOverride.trim() ? priceOverride.trim() : null,
    };
    const opts = { onSuccess: onClose };
    if (pkg) update.mutate({ id: pkg.id, ...payload }, opts);
    else create.mutate(payload, opts);
  };

  return (
    <Modal title={pkg ? `Edit — ${pkg.name}` : "New Package"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          className={inputClass}
          placeholder="Package name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={inputClass}
          placeholder="Tagline (optional)"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
        <textarea
          className={inputClass}
          placeholder="Description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            className={inputClass}
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
          >
            <option value="">No public page</option>
            {COLLECTIONS.map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
          <select
            className={inputClass}
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Service picker with a live total */}
        <div className="rounded-[16px] border border-[var(--dash-border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="gotham text-[var(--dash-text-soft)] text-[14px] font-bold">Services in this package</span>
            <span className="gotham text-[var(--dash-text-faint)] text-[13px]">
              {durationLabel(totalDuration)} · {money(suggestedTotal)} total
            </span>
          </div>
          <div className="max-h-[220px] overflow-y-auto flex flex-col gap-1.5">
            {(services ?? []).map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-3 gotham text-[var(--dash-text)] text-[14px] cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  checked={selectedSet.has(s.id)}
                  onChange={() => toggleService(s.id)}
                  className="accent-[#cba660] w-4 h-4"
                />
                <span className="flex-1">{s.name}</span>
                <span className="text-[var(--dash-text-faint)] text-[13px]">{durationLabel(s.duration_minutes)}</span>
                <span className="text-[#cda873] text-[13px] w-16 text-right">{money(s.current_price)}</span>
              </label>
            ))}
          </div>
          {selectedIds.length === 0 && (
            <p className="gotham text-red-400 text-[13px] mt-2">Select at least one service.</p>
          )}
        </div>

        {/* Package price — defaults to the suggested total, editable per package */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <input
              className={inputClass}
              type="number"
              min={0}
              step="0.01"
              placeholder={suggestedTotal ? `${suggestedTotal.toFixed(2)} (sum)` : "Package price ($)"}
              value={priceOverride}
              onChange={(e) => setPriceOverride(e.target.value)}
            />
            <p className="gotham text-[var(--dash-text-faint)] text-[12px] mt-1.5">
              Leave blank to charge the {money(suggestedTotal)} total. Enter a value to set a
              different package price.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-[#cba660] w-5 h-5" />
              Featured
            </label>
            <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#cba660] w-5 h-5" />
              Active
            </label>
          </div>
        </div>

        {/* Includes bullet editor */}
        <div>
          <span className="gotham text-[var(--dash-text-soft)] text-[14px] font-bold">What&apos;s included</span>
          <div className="flex flex-col gap-2 mt-2">
            {includes.map((line, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder={`Bullet ${i + 1}`}
                  value={line}
                  onChange={(e) => setIncludes((arr) => arr.map((v, idx) => (idx === i ? e.target.value : v)))}
                />
                <button
                  type="button"
                  onClick={() => setIncludes((arr) => (arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr))}
                  className="text-[var(--dash-text-muted)] hover:text-red-400 px-2 text-[18px] cursor-pointer"
                  aria-label="Remove bullet"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIncludes((arr) => [...arr, ""])}
            className="gotham text-[13px] text-[#cda873] mt-2 cursor-pointer hover:underline"
          >
            + Add bullet
          </button>
        </div>

        <textarea
          className={inputClass}
          placeholder="What's not included (optional)"
          rows={2}
          value={notIncluded}
          onChange={(e) => setNotIncluded(e.target.value)}
        />
        <textarea
          className={inputClass}
          placeholder="Best for (optional)"
          rows={2}
          value={bestFor}
          onChange={(e) => setBestFor(e.target.value)}
        />

        {error && <p className="gotham text-red-400 text-[14px]">{error.message}</p>}
        <div className="flex justify-between items-center gap-3 mt-2">
          {pkg ? (
            <button
              type="button"
              onClick={() => del.mutate(pkg.id, { onSuccess: onClose })}
              className="gotham text-[13px] text-red-400 hover:text-red-300 cursor-pointer"
            >
              Deactivate package
            </button>
          ) : <span />}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className={buttonGhost}>Cancel</button>
            <button type="submit" disabled={pending || selectedIds.length === 0} className={buttonGold}>
              {pending ? "Saving…" : "Save Package"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

/* --------------------------- Price history modal ----------------------------- */

function PackagePriceHistoryModal({ pkg, onClose }: { pkg: Package; onClose: () => void }) {
  const { data: history, isLoading } = usePackagePriceHistory(pkg.id);

  return (
    <Modal title={`Price History — ${pkg.name}`} onClose={onClose}>
      {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading timeline…</p>}
      <div className="flex flex-col">
        {(history ?? []).map((entry, i) => (
          <div key={entry.id} className="flex gap-5">
            <div className="flex flex-col items-center">
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 ${
                  entry.effective_until === null
                    ? "bg-[#cba660] border-[#cba660]"
                    : "bg-transparent border-[var(--dash-border)]"
                }`}
              />
              {i < (history?.length ?? 0) - 1 && <span className="w-[2px] flex-1 bg-[var(--dash-border)] my-1" />}
            </div>
            <div className="pb-7">
              <div className="flex items-baseline gap-3">
                <span className="gotham font-bold text-[var(--dash-text)] text-[20px]">{money(entry.price)}</span>
                {entry.effective_until === null && (
                  <span className="gotham text-[12px] uppercase tracking-wider text-[#cda873] bg-[#cba660]/15 border border-[#cba660]/40 px-2.5 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p className="gotham text-[var(--dash-text-muted)] text-[14px] mt-1">
                {shortDate(entry.effective_from)} —{" "}
                {entry.effective_until ? shortDate(entry.effective_until) : "present"}
              </p>
              {entry.created_by && (
                <p className="gotham text-[var(--dash-text-faint)] text-[13px] mt-0.5">
                  Set by {entry.created_by.name}
                </p>
              )}
            </div>
          </div>
        ))}
        {!isLoading && (history ?? []).length === 0 && (
          <p className="gotham text-[var(--dash-text-faint)] text-[14px]">No pricing history yet.</p>
        )}
      </div>
    </Modal>
  );
}
