"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type {
  LoyaltyBalance,
  LoyaltySettings,
  LoyaltyTransaction,
  Paginated,
  ShoutoutClaim,
  ShoutoutStatus,
} from "../types";

export function useLoyaltyBalance() {
  return useQuery({
    queryKey: ["loyalty", "balance"],
    queryFn: () => api.get<LoyaltyBalance>("/loyalty/balance"),
  });
}

export function useLoyaltyTransactions(page = 1) {
  return useQuery({
    queryKey: ["loyalty", "transactions", page],
    queryFn: () =>
      api.get<Paginated<LoyaltyTransaction>>("/loyalty/transactions", { params: { page } }),
  });
}

/* -------------------------------- Shoutouts ----------------------------------- */

export function useMyShoutouts() {
  return useQuery({
    queryKey: ["shoutouts", "mine"],
    queryFn: () => api.get<{ data: ShoutoutClaim[] }>("/shoutouts").then((r) => r.data),
  });
}

/** Screenshot proof upload — multipart to /shoutout-claims. */
export function useSubmitShoutout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ platform, file }: { platform: string; file: File }) => {
      const form = new FormData();
      form.append("platform", platform);
      form.append("proof_image", file);
      return api.postForm<{ data: ShoutoutClaim }>("/shoutout-claims", form);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shoutouts"] }),
  });
}

/* --------------------------------- Admin -------------------------------------- */

export function useShoutoutQueue(status: ShoutoutStatus = "pending") {
  return useQuery({
    queryKey: ["shoutouts", "queue", status],
    queryFn: () =>
      api
        .get<{ data: ShoutoutClaim[] }>("/admin/shoutouts", { params: { status } })
        .then((r) => r.data),
  });
}

export function useReviewShoutout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
      admin_notes,
    }: {
      id: number;
      action: "approve" | "reject";
      admin_notes?: string;
    }) => api.post<{ data: ShoutoutClaim }>(`/admin/shoutouts/${id}/${action}`, { admin_notes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shoutouts"] }),
  });
}

export function useLoyaltySettings() {
  return useQuery({
    queryKey: ["loyalty", "settings"],
    queryFn: () => api.get<LoyaltySettings>("/admin/loyalty-settings"),
  });
}

export function useUpdateLoyaltySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<LoyaltySettings>) =>
      api.put<LoyaltySettings>("/admin/loyalty-settings", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loyalty"] }),
  });
}

export function useAdjustLoyaltyPoints() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { user_id: number; amount: number; description: string }) =>
      api.post<void>("/admin/loyalty/adjust", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loyalty"] }),
  });
}
