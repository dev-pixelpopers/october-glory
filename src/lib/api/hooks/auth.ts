"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, setToken, getToken } from "../client";
import type { AuthResponse, RegisterResponse, User } from "../types";

function storeAuth(qc: ReturnType<typeof useQueryClient>, res: AuthResponse) {
  setToken(res.token);
  qc.setQueryData(["me"], { ...res.user, session_scope: res.session_scope });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () =>
      api
        .get<{ data: User; session_scope: User["session_scope"] }>("/me")
        .then((r) => ({ ...r.data, session_scope: r.session_scope })),
    enabled: !!getToken(),
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", payload),
    onSuccess: (res) => storeAuth(qc, res),
  });
}

/**
 * Full-account sign-up. Returns 201 WITHOUT a token — the account stays
 * unverified until the emailed 6-digit code is confirmed via useVerifyOtp.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: { name: string; email: string; password: string; phone?: string }) =>
      api.post<RegisterResponse>("/auth/register", payload),
  });
}

/**
 * Frictionless "Continue as Guest": name + email, immediate session, no OTP.
 * Existing full accounts receive an ability-scoped token (session_scope
 * "guest") that can book but not touch loyalty/history.
 */
export function useGuestSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; email: string; phone?: string }) =>
      api.post<AuthResponse>("/auth/guest-session", payload),
    onSuccess: (res) => storeAuth(qc, res),
  });
}

/** Activates a registration (or signs in a passwordless guest) with the emailed code. */
export function useVerifyOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; otp_code: string }) =>
      api.post<AuthResponse>("/auth/verify-otp", payload),
    onSuccess: (res) => storeAuth(qc, res),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      api.post<{ message: string }>("/auth/resend-otp", payload),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<void>("/auth/logout"),
    // Always clear local auth state — even if the API call 401s because the
    // token was already destroyed, the user must end up signed out locally.
    onSettled: () => {
      setToken(null);
      qc.clear();
    },
  });
}

/** Converts a guest into a full account with standard email/password login. */
export function useSetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { password: string }) =>
      api.post<{ user: User }>("/auth/set-password", payload),
    onSuccess: (res) => qc.setQueryData(["me"], { ...res.user, session_scope: "full" as const }),
  });
}
