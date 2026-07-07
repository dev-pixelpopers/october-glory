"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../client";
import type {
  AppointmentVolumePoint,
  AuditLog,
  AuditLogFilters,
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
