"use client";

import React, { useState } from "react";
import {
  useCategories,
  useCreateService,
  usePriceHistory,
  useServices,
  useUpdateService,
  type ServicePayload,
} from "@/lib/api/hooks/catalog";
import type { Service } from "@/lib/api/types";
import { durationLabel, money, shortDate } from "@/lib/format";
import { buttonGhost, buttonGold, Card, inputClass } from "../dashboard-shell";

/** Service catalog CRUD; price edits append to the history ledger. */
export default function ServiceManager() {
  const { data: services } = useServices();
  const { data: categories } = useCategories();
  const [editing, setEditing] = useState<Service | "new" | null>(null);
  const [historyFor, setHistoryFor] = useState<Service | null>(null);

  return (
    <>
      <Card
        title="Service Catalog"
        action={
          <button className={buttonGold} onClick={() => setEditing("new")}>
            + New Service
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--dash-border)]">
                {["Service", "Category", "Duration", "Current Price", "Status", ""].map((h) => (
                  <th key={h} className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dash-border-soft)]">
              {(services ?? []).map((s) => (
                <tr key={s.id}>
                  <td className="gotham text-[var(--dash-text)] text-[15px] py-4 pr-4">{s.name}</td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4">{s.category?.name ?? "—"}</td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4">{durationLabel(s.duration_minutes)}</td>
                  <td className="gotham font-bold text-[#cda873] text-[15px] pr-4">{money(s.current_price)}</td>
                  <td className="pr-4">
                    <span className={`gotham text-[13px] ${s.is_active ? "text-green-500" : "text-[var(--dash-text-faint)]"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setHistoryFor(s)}
                        className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[#cda873] px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                      >
                        View Price History
                      </button>
                      <button
                        onClick={() => setEditing(s)}
                        className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <ServiceFormModal
          service={editing === "new" ? null : editing}
          categories={categories ?? []}
          onClose={() => setEditing(null)}
        />
      )}
      {historyFor && <PriceHistoryModal service={historyFor} onClose={() => setHistoryFor(null)} />}
    </>
  );
}

/* ------------------------------ Form modal ---------------------------------- */

function ServiceFormModal({
  service,
  categories,
  onClose,
}: {
  service: Service | null;
  categories: { id: number; name: string }[];
  onClose: () => void;
}) {
  const create = useCreateService();
  const update = useUpdateService();
  const [form, setForm] = useState<ServicePayload>({
    name: service?.name ?? "",
    description: service?.description ?? "",
    category_id: service?.category_id ?? null,
    duration_minutes: service?.duration_minutes ?? 60,
    price: service?.current_price ?? "",
    is_active: service?.is_active ?? true,
  });

  const pending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = { onSuccess: onClose };
    if (service) update.mutate({ id: service.id, ...form }, opts);
    else create.mutate(form, opts);
  };

  return (
    <Modal title={service ? `Edit — ${service.name}` : "New Service"} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          className={inputClass}
          placeholder="Service name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          className={inputClass}
          placeholder="Description"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            className={inputClass}
            value={form.category_id ?? ""}
            onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            className={inputClass}
            type="number"
            min={5}
            step={5}
            placeholder="Duration (min)"
            value={form.duration_minutes}
            onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <input
            className={inputClass}
            type="number"
            min={0}
            step="0.01"
            placeholder="Price ($)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="accent-[#cba660] w-5 h-5"
            />
            Active
          </label>
        </div>
        {service && (
          <p className="gotham text-[var(--dash-text-faint)] text-[13px]">
            Changing the price closes the current history row and opens a new one — past pricing is never overwritten.
          </p>
        )}
        {error && <p className="gotham text-red-400 text-[14px]">{error.message}</p>}
        <div className="flex justify-end gap-3 mt-2">
          <button type="button" onClick={onClose} className={buttonGhost}>Cancel</button>
          <button type="submit" disabled={pending} className={buttonGold}>
            {pending ? "Saving…" : "Save Service"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* --------------------------- Price history modal ----------------------------- */

function PriceHistoryModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const { data: history, isLoading } = usePriceHistory(service.id);

  return (
    <Modal title={`Price History — ${service.name}`} onClose={onClose}>
      {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading timeline…</p>}
      <div className="flex flex-col">
        {(history ?? []).map((entry, i) => (
          <div key={entry.id} className="flex gap-5">
            {/* Timeline spine */}
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
      </div>
    </Modal>
  );
}

/* --------------------------------- Modal ------------------------------------- */

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-[var(--dash-card)] border border-[#cba660]/30 rounded-[22px] p-8 w-full max-w-[560px] max-h-[85vh] overflow-y-auto shadow-[0_1vh_4vh_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="gotham font-bold text-[var(--dash-text)] text-[19px]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] text-[22px] leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
