/**
 * Thin typed fetch wrapper for the headless Laravel API.
 * Token is a Sanctum personal access token stored in localStorage.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const TOKEN_KEY = "og_auth_token";

/**
 * Routing-hint cookie mirroring token presence so the server-side proxy
 * (src/proxy.ts) can gate /dashboard routes. It carries no secret and is NOT
 * a security boundary — the API enforces real auth on every request.
 */
const SESSION_COOKIE = "og_session";

function syncSessionCookie(hasToken: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = hasToken
    ? `${SESSION_COOKIE}=1; path=/; max-age=31536000; SameSite=Lax`
    : `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
  syncSessionCookie(!!token);
}

// Sessions created before the cookie existed: heal the hint on first load.
if (typeof window !== "undefined" && window.localStorage.getItem(TOKEN_KEY)) {
  syncSessionCookie(true);
}

export class ApiError extends Error {
  status: number;
  /** Machine-readable error code from the API, e.g. "USER_REQUIRES_PASSWORD". */
  code?: string;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>, code?: string) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined | null | number[]>;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  { params, body, signal }: RequestOptions = {},
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) url.searchParams.append(`${key}[]`, String(v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const token = getToken();
  const res = await fetch(url.toString(), {
    method,
    signal,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? `Request failed with status ${res.status}`,
      json?.errors,
      json?.code,
    );
  }

  return json as T;
}

/** multipart/form-data POST — browser sets the boundary header itself. */
async function postForm<T>(path: string, form: FormData): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });

  if (res.status === 204) return undefined as T;
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? `Request failed with status ${res.status}`,
      json?.errors,
      json?.code,
    );
  }

  return json as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, opts),
  postForm,
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, { ...opts, body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PUT", path, { ...opts, body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PATCH", path, { ...opts, body }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),
};
