"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type {
  AppointmentVolumePoint,
  AuditLog,
  AuditLogFilters,
  Client,
  LoyaltyEconomyPoint,
  Paginated,
  RevenueGranularity,
  RevenuePoint,
  WorkerUtilizationPoint,
} from "../types";

export function useRevenueAnalytics(granularity: RevenueGranularity) {
  return useQuery({
    queryKey: ["analytics", "revenue", granularity],
    queryFn: () =>
      api
        .get<{ data: RevenuePoint[] }>("/admin/analytics/revenue", { params: { granularity } })
        .then((r) => r.data),
  });
}

export function useAppointmentVolume() {
  return useQuery({
    queryKey: ["analytics", "volume"],
    queryFn: () =>
      api
        .get<{ data: AppointmentVolumePoint[] }>("/admin/analytics/appointment-volume")
        .then((r) => r.data),
  });
}

export function useWorkerUtilization() {
  return useQuery({
    queryKey: ["analytics", "utilization"],
    queryFn: () =>
      api
        .get<{ data: WorkerUtilizationPoint[] }>("/admin/analytics/worker-utilization")
        .then((r) => r.data),
  });
}

export function useLoyaltyEconomy() {
  return useQuery({
    queryKey: ["analytics", "loyalty-economy"],
    queryFn: () =>
      api
        .get<{ data: LoyaltyEconomyPoint[] }>("/admin/analytics/loyalty-economy")
        .then((r) => r.data),
  });
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () =>
      api.get<Paginated<AuditLog>>("/admin/audit-logs", { params: { ...filters } }),
  });
}

/* ------------------------------- Image uploads -------------------------------- */

export type UploadFolder = "services" | "products" | "packages" | "categories" | "workers";

/** Upload an image; resolves to its public URL, saved on a record like a pasted URL. */
export function useUploadImage(folder: UploadFolder) {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("image", file);
      form.append("folder", folder);
      return api
        .postForm<{ url: string; path: string }>("/admin/uploads/image", form)
        .then((r) => r.url);
    },
  });
}

/* ------------------------------- Clients & membership ------------------------- */

export function useClients(filters: { q?: string; members?: boolean; page?: number } = {}) {
  return useQuery({
    queryKey: ["clients", filters],
    queryFn: () =>
      api.get<Paginated<Client>>("/admin/clients", {
        params: { q: filters.q || undefined, members: filters.members ? 1 : undefined, page: filters.page },
      }),
  });
}

/** Make a client a member (optionally until a date), or end their membership. */
export function useUpdateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number; is_member: boolean; ends_at?: string | null }) =>
      api.put<{ data: Client }>(`/admin/clients/${id}/membership`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}
