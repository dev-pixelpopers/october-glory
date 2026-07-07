"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type {
  Service,
  ServiceCategory,
  ServicePriceHistoryEntry,
  Worker,
  WorkerSchedule,
} from "../types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<{ data: ServiceCategory[] }>("/categories").then((r) => r.data),
  });
}

export function useServices(categoryId?: number) {
  return useQuery({
    queryKey: ["services", categoryId ?? "all"],
    queryFn: () =>
      api
        .get<{ data: Service[] }>("/services", { params: { category_id: categoryId } })
        .then((r) => r.data),
  });
}

/** Workers qualified to perform ALL of the given services. */
export function useQualifiedWorkers(serviceIds: number[]) {
  return useQuery({
    queryKey: ["workers", "qualified", [...serviceIds].sort()],
    queryFn: () =>
      api
        .get<{ data: Worker[] }>("/workers", { params: { service_ids: serviceIds } })
        .then((r) => r.data),
    enabled: serviceIds.length > 0,
  });
}

/* ------------------------------- Admin: services ------------------------------ */

export function usePriceHistory(serviceId: number | null) {
  return useQuery({
    queryKey: ["price-history", serviceId],
    queryFn: () =>
      api
        .get<{ data: ServicePriceHistoryEntry[] }>(`/admin/services/${serviceId}/price-history`)
        .then((r) => r.data),
    enabled: serviceId !== null,
  });
}

export interface ServicePayload {
  name: string;
  description?: string;
  category_id?: number | null;
  duration_minutes: number;
  price: string;
  is_active?: boolean;
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServicePayload) =>
      api.post<{ data: Service }>("/admin/services", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: ServicePayload & { id: number }) =>
      api.put<{ data: Service }>(`/admin/services/${id}`, payload),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["price-history", vars.id] });
    },
  });
}

/* ------------------------------- Admin: workers ------------------------------- */

export function useWorkers() {
  return useQuery({
    queryKey: ["workers", "all"],
    queryFn: () => api.get<{ data: Worker[] }>("/admin/workers").then((r) => r.data),
  });
}

export interface WorkerPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  specialties?: string[];
  is_active?: boolean;
  service_ids?: number[];
  schedules?: Omit<WorkerSchedule, "id" | "worker_profile_id">[];
}

export function useCreateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WorkerPayload) =>
      api.post<{ data: Worker }>("/admin/workers", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}

export function useUpdateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<WorkerPayload> & { id: number }) =>
      api.put<{ data: Worker }>(`/admin/workers/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workers"] }),
  });
}
