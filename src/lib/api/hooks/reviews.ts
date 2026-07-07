"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import type { Review, WorkerMetrics } from "../types";

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { appointment_id: number; rating: number; comment?: string }) =>
      api.post<{ data: Review }>("/reviews", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["worker-metrics"] });
    },
  });
}

/** Signed-in worker's own aggregate rating + feedback list. */
export function useWorkerMetrics() {
  return useQuery({
    queryKey: ["worker-metrics"],
    queryFn: () => api.get<WorkerMetrics>("/worker/metrics"),
  });
}
