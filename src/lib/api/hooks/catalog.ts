"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type {
  Package,
  PackagePriceHistoryEntry,
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

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      api.post<{ data: ServiceCategory }>("/admin/categories", { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api.put<{ data: ServiceCategory }>(`/admin/categories/${id}`, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/admin/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["packages"] });
    },
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

/* ------------------------------- Packages ------------------------------------ */

/** Public: active packages, optionally filtered to one marketing collection. */
export function usePackages(collection?: string) {
  return useQuery({
    queryKey: ["packages", collection ?? "all"],
    queryFn: () =>
      api
        .get<{ data: Package[] }>("/packages", { params: { collection } })
        .then((r) => r.data),
  });
}

export function usePackagePriceHistory(packageId: number | null) {
  return useQuery({
    queryKey: ["package-price-history", packageId],
    queryFn: () =>
      api
        .get<{ data: PackagePriceHistoryEntry[] }>(`/admin/packages/${packageId}/price-history`)
        .then((r) => r.data),
    enabled: packageId !== null,
  });
}

export interface PackagePayload {
  name: string;
  collection?: string | null;
  category_id?: number | null;
  tagline?: string | null;
  description?: string | null;
  includes?: string[];
  not_included?: string | null;
  best_for?: string | null;
  is_featured?: boolean;
  is_active?: boolean;
  service_ids: number[];
  /** Omit/blank to default to the summed price of the selected services. */
  price?: string | null;
}

export function useCreatePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PackagePayload) =>
      api.post<{ data: Package }>("/admin/packages", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });
}

export function useUpdatePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<PackagePayload> & { id: number }) =>
      api.put<{ data: Package }>(`/admin/packages/${id}`, payload),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["packages"] });
      qc.invalidateQueries({ queryKey: ["package-price-history", vars.id] });
    },
  });
}

export function useDeletePackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<{ data: Package }>(`/admin/packages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
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
