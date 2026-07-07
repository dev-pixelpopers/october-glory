"use client";

import React, { useState } from "react";
import { useAuditLogs } from "@/lib/api/hooks/admin";
import type { AuditLog } from "@/lib/api/types";
import { Card, inputClass } from "../dashboard-shell";

/** Searchable, filterable system audit trail with old/new JSON diff. */
export default function AuditLogViewer() {
  const [filters, setFilters] = useState({ log_name: "", search: "", from: "", to: "", page: 1 });
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, isLoading } = useAuditLogs({
    log_name: filters.log_name || undefined,
    search: filters.search || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    page: filters.page,
  });

  const set = (patch: Partial<typeof filters>) => setFilters({ ...filters, page: 1, ...patch });

  return (
    <Card title="System Audit Log">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input
          className={inputClass}
          placeholder="Search description…"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
        />
        <select
          className={inputClass}
          value={filters.log_name}
          onChange={(e) => set({ log_name: e.target.value })}
        >
          <option value="">All entities</option>
          {["appointment", "service", "service_category", "worker_profile", "worker_schedule", "loyalty", "shoutout_claim", "review", "user", "setting"].map((n) => (
            <option key={n} value={n}>{n.replace(/_/g, " ")}</option>
          ))}
        </select>
        <input type="date" className={inputClass} value={filters.from} onChange={(e) => set({ from: e.target.value })} />
        <input type="date" className={inputClass} value={filters.to} onChange={(e) => set({ to: e.target.value })} />
      </div>

      {isLoading && <p className="gotham text-[var(--dash-text-muted)] text-[15px]">Loading audit trail…</p>}

      <div className="flex flex-col divide-y divide-[var(--dash-border-soft)]">
        {(data?.data ?? []).map((log: AuditLog) => (
          <div key={log.id} className="py-4">
            <button
              onClick={() => setExpanded(expanded === log.id ? null : log.id)}
              className="w-full flex flex-wrap items-center gap-x-5 gap-y-1 text-left cursor-pointer group"
            >
              <span className="gotham text-[var(--dash-text-faint)] text-[13px] w-[150px] shrink-0">
                {new Date(log.created_at).toLocaleString()}
              </span>
              <span className="gotham text-[#cda873] text-[13px] uppercase tracking-wider w-[130px] shrink-0">
                {log.log_name}
              </span>
              <span className="gotham text-[var(--dash-text)] text-[15px] flex-1 group-hover:text-[#cda873] transition-colors">
                {log.description}
              </span>
              <span className="gotham text-[var(--dash-text-muted)] text-[14px]">
                {log.causer?.name ?? "System"}
              </span>
            </button>

            {expanded === log.id && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest mb-2">Old Values</p>
                  <pre className="bg-[var(--dash-bg)] border border-[var(--dash-border-soft)] rounded-[14px] p-4 text-[12.5px] text-red-400 overflow-x-auto font-mono">
                    {JSON.stringify(log.properties?.old_values ?? {}, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest mb-2">New Values</p>
                  <pre className="bg-[var(--dash-bg)] border border-[var(--dash-border-soft)] rounded-[14px] p-4 text-[12.5px] text-green-500 overflow-x-auto font-mono">
                    {JSON.stringify(log.properties?.new_values ?? {}, null, 2)}
                  </pre>
                </div>
                {log.ip_address && (
                  <p className="gotham text-[var(--dash-text-faint)] text-[13px]">IP: {log.ip_address}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {data && data.meta.last_page > 1 && (
        <Pagination
          page={data.meta.current_page}
          lastPage={data.meta.last_page}
          onChange={(p) => setFilters({ ...filters, page: p })}
        />
      )}
    </Card>
  );
}

export function Pagination({
  page,
  lastPage,
  onChange,
}: {
  page: number;
  lastPage: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="gotham text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] disabled:opacity-30 text-[14px] px-4 py-2 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
      >
        ← Prev
      </button>
      <span className="gotham text-[var(--dash-text-muted)] text-[14px]">
        Page {page} of {lastPage}
      </span>
      <button
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
        className="gotham text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] disabled:opacity-30 text-[14px] px-4 py-2 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
      >
        Next →
      </button>
    </div>
  );
}
