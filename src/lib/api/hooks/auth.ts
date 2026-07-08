"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, setToken, getToken, ApiError } from "../client";
import { showToast } from "@/app/components/salon/toast";
import type { AuthResponse, RegisterResponse, User } from "../types";

/** API error code: guest checkout denied because the email has a password. */
export const USER_REQUIRES_PASSWORD = "USER_REQUIRES_PASSWORD";

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
 * If the email belongs to a full registered account the API answers 409
 * USER_REQUIRES_PASSWORD — the user is routed to the login screen with
 * their email pre-filled instead.
 */
export function useGuestSession() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: { name: string; email: string; phone?: string }) =>
      api.post<AuthResponse>("/auth/guest-session", payload),
    onSuccess: (res) => storeAuth(qc, res),
    onError: (err, vars) => {
      if (err instanceof ApiError && err.code === USER_REQUIRES_PASSWORD) {
        showToast("Account found! Please log in with your password to continue.", "info");
        const params = new URLSearchParams({ email: vars.email });
        // Keep the post-login callback alive across the guest → login handoff.
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        if (redirect) params.set("redirect", redirect);
        router.push(`/login?${params.toString()}`);
      }
    },
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

/** Step 1 of password reset: emails a 6-digit code. Response is always 200. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: { email: string }) =>
      api.post<{ message: string }>("/auth/forgot-password", payload),
  });
}

/**
 * Step 2 of password reset: code + new password → fresh full session.
 * The backend revokes all older tokens, so every cached query is stale.
 */
export function useResetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      email: string;
      otp_code: string;
      password: string;
      password_confirmation: string;
    }) => api.post<AuthResponse>("/auth/reset-password", payload),
    onSuccess: (res) => {
      storeAuth(qc, res);
      // Everything else cached before the reset belongs to the old session.
      // (Not qc.clear() — that detaches mounted observers, so the login
      // screen would never see the new "me" and never redirect.)
      qc.invalidateQueries({ predicate: (q) => q.queryKey[0] !== "me" });
    },
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
