"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type {
  AppNotification,
  NotificationFilters,
  Paginated,
  UnreadNotificationCountResponse,
} from "../types";

export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: () =>
      api.get<Paginated<AppNotification>>("/notifications", {
        params: {
          page: filters.page,
          per_page: filters.per_page,
          unread: filters.unread ? 1 : undefined,
          status: filters.status,
          type: filters.type,
        },
      }),
  });
}

export function useUnreadNotificationCount(refetchInterval: number = 30000) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () =>
      api.get<UnreadNotificationCountResponse>("/notifications/unread-count"),
    refetchInterval,
    refetchIntervalInBackground: false,
  });
}

export function useMarkNotificationAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.patch<AppNotification>(`/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.patch<{ message: string; marked_count: number }>("/notifications/read-all"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete<{ message: string }>(`/notifications/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
