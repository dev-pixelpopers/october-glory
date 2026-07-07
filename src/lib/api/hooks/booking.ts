"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  AvailabilitySlot,
  BookingPayload,
  Paginated,
} from "../types";

/**
 * Open slots for the given date + service set.
 * workerId === null means "Any Specialist" — the backend slides the window
 * across every qualified worker and unions the results.
 */
export function useAvailability(
  date: string | null,
  serviceIds: number[],
  workerId: number | null,
) {
  return useQuery({
    queryKey: ["availability", date, [...serviceIds].sort(), workerId],
    queryFn: () =>
      api
        .get<{ data: AvailabilitySlot[] }>("/availability", {
          params: {
            date: date!,
            service_ids: serviceIds,
            worker_id: workerId ?? undefined,
          },
        })
        .then((r) => r.data),
    enabled: !!date && serviceIds.length > 0,
    staleTime: 10_000,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingPayload) =>
      api.post<{ data: Appointment }>("/appointments", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["availability"] });
      qc.invalidateQueries({ queryKey: ["loyalty"] });
    },
  });
}

/** Role-scoped: clients get their own, workers their assigned, admins everything. */
export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: () =>
      api.get<Paginated<Appointment>>("/appointments", {
        params: { ...filters },
      }),
  });
}

export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      api.patch<{ data: Appointment }>(`/appointments/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch<{ data: Appointment }>(`/appointments/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useRescheduleAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, start_time, worker_id }: { id: number; start_time: string; worker_id?: number }) =>
      api.patch<{ data: Appointment }>(`/admin/appointments/${id}/reschedule`, {
        start_time,
        worker_id,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}
