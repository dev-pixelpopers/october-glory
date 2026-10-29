"use client";

import React, { useState } from "react";
import { Crown } from "lucide-react";
import { useClients, useUpdateMembership } from "@/lib/api/hooks/admin";
import type { Client } from "@/lib/api/types";
import { shortDate } from "@/lib/format";
import { buttonGhost, buttonGold, Card, inputClass } from "../dashboard-shell";
import { Modal } from "./service-manager";

/** Clients and their membership: members get the member discount on every booking. */
export default function ClientManager() {
  const [q, setQ] = useState("");
  const [membersOnly, setMembersOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Client | null>(null);
  const { data, isLoading } = useClients({ q, members: membersOnly, page });

  const clients = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <Card title="Clients & Membership">
        <div className="flex flex-wrap gap-4 items-center mb-5">
          <input
            className={`${inputClass} !w-auto flex-1 min-w-[220px]`}
            placeholder="Search name or email"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <label className="flex items-center gap-3 gotham text-[var(--dash-text-soft)] text-[15px] cursor-pointer">
            <input
              type="checkbox"
              checked={membersOnly}
              onChange={(e) => {
                setMembersOnly(e.target.checked);
                setPage(1);
              }}
              className="accent-[#cba660] w-5 h-5"
            />
            Members only
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--dash-border)]">
                {["Client", "Email", "Bookings", "Membership", ""].map((h) => (
                  <th key={h} className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest py-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--dash-border-soft)]">
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="gotham text-[var(--dash-text)] text-[15px] py-4 pr-4">
                    {c.name}
                    {c.is_guest && (
                      <span className="ml-2 gotham text-[11px] uppercase tracking-wider text-[var(--dash-text-faint)]">Guest</span>
                    )}
                  </td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4">{c.email}</td>
                  <td className="gotham text-[var(--dash-text-muted)] text-[14px] pr-4">{c.appointments_count}</td>
                  <td className="pr-4">
                    {c.is_member ? (
                      <span className="inline-flex items-center gap-1.5 gotham text-[13px] text-[#cda873]">
                        <Crown className="w-4 h-4" />
                        Member{c.membership_ends_at ? ` until ${shortDate(c.membership_ends_at)}` : ""}
                      </span>
                    ) : (
                      <span className="gotham text-[13px] text-[var(--dash-text-faint)]">—</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setEditing(c)}
                      className="gotham text-[13px] text-[var(--dash-text-muted)] hover:text-[var(--dash-text)] px-3 py-1.5 rounded-full border border-[var(--dash-border)] transition-colors cursor-pointer"
                    >
                      {c.is_member ? "Manage" : "Make Member"}
                    </button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} className="gotham text-[var(--dash-text-faint)] text-[14px] py-8 text-center">
                    {isLoading ? "Loading clients…" : "No clients found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-end gap-3 mt-5">
            <button className={buttonGhost} disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span className="gotham text-[var(--dash-text-muted)] text-[14px]">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <button className={buttonGhost} disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </Card>

      {editing && <MembershipModal client={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function MembershipModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const update = useUpdateMembership();
  const [endsAt, setEndsAt] = useState(client.membership_ends_at?.slice(0, 10) ?? "");
  // Earliest end date the API accepts (after today), fixed when the modal opens.
  const [minEndDate] = useState(() => new Date(Date.now() + 86_400_000).toISOString().slice(0, 10));

  const grant = () =>
    update.mutate({ id: client.id, is_member: true, ends_at: endsAt || null }, { onSuccess: onClose });
  const revoke = () => update.mutate({ id: client.id, is_member: false }, { onSuccess: onClose });

  return (
    <Modal title={`Membership — ${client.name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="gotham text-[var(--dash-text-soft)] text-[15px] leading-relaxed">
          {client.is_member
            ? `${client.name} is a member${client.membership_since ? ` since ${shortDate(client.membership_since)}` : ""}. Members get the member discount on every booking.`
            : `Make ${client.name} a member to give them the member discount on every booking.`}
        </p>
        <label className="flex flex-col gap-2">
          <span className="gotham text-[var(--dash-text-faint)] text-[12px] uppercase tracking-widest">
            Ends on (optional)
          </span>
          <input
            type="date"
            className={inputClass}
            value={endsAt}
            min={minEndDate}
            onChange={(e) => setEndsAt(e.target.value)}
          />
          <span className="gotham text-[var(--dash-text-faint)] text-[12px]">Leave blank for no end date.</span>
        </label>
        {update.error && <p className="gotham text-red-400 text-[14px]">{update.error.message}</p>}
        <div className="flex justify-between items-center gap-3 mt-2">
          {client.is_member ? (
            <button
              type="button"
              onClick={revoke}
              disabled={update.isPending}
              className="gotham text-[13px] text-red-400 hover:text-red-300 cursor-pointer"
            >
              End membership
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className={buttonGhost}>Cancel</button>
            <button type="button" onClick={grant} disabled={update.isPending} className={buttonGold}>
              {update.isPending ? "Saving…" : client.is_member ? "Update" : "Make Member"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
