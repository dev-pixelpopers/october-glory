/**
 * DTO definitions matching the Laravel API resources (backend/app/Http/Resources).
 * Keep these in sync with the backend — they are the single source of truth
 * for every TanStack Query hook in src/lib/api/hooks.
 */

export type Role = "admin" | "worker" | "client";

export type AppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentMethod = "card" | "pay_upon_arrival";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ShoutoutStatus = "pending" | "approved" | "rejected";

export type LoyaltyTransactionType =
  | "booking_reward"
  | "shoutout_bonus"
  | "redemption"
  | "admin_adjustment"
  | "expiration";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
  is_active: boolean;
  /** Passwordless account created via "Continue as Guest". */
  is_guest: boolean;
  has_password: boolean;
  /** Has a membership in force now — books at the member discount. */
  is_member: boolean;
  membership_ends_at: string | null;
  /** Fraction members save, e.g. 0.3 — the same rate the API applies at booking. */
  member_discount_rate: number;
  /**
   * "guest" = ability-scoped guest-session on a full account: booking works,
   * but loyalty redemption / history / role-gated areas are locked until the
   * owner signs in with their password.
   */
  session_scope?: SessionScope;
  created_at: string;
}

export type SessionScope = "full" | "guest";

/** POST /auth/register — 201 with no token; email OTP required first. */
export interface RegisterResponse {
  requires_verification: boolean;
  email: string;
  message: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  session_scope: SessionScope;
}

export interface ServiceCategory {
  id: number;
  name: string;
  /** The blurb under its card in the full-screen menu. */
  description: string | null;
  /** The site page's URL slug (/services/<slug>); kept fixed on rename. */
  slug: string;
  image: string | null;
  /** A service page or a package page on the site. */
  kind: "services" | "packages";
  sort_order: number;
}

export interface Service {
  id: number;
  category_id: number | null;
  category?: ServiceCategory | null;
  name: string;
  /** Matches the site page (/services/<category>/<slug>) when one exists. */
  slug: string | null;
  sort_order: number;
  description: string | null;
  /** Site path (e.g. /images/RodSet-01.webp) or full URL. */
  image: string | null;
  duration_minutes: number;
  is_active: boolean;
  /** Derived from the service_price_history row where effective_until IS NULL. */
  current_price: string;
  /** Quoted at consultation (e.g. custom units); current_price is then 0.00. */
  price_by_consultation: boolean;
}

export interface ServicePriceHistoryEntry {
  id: number;
  service_id: number;
  price: string;
  effective_from: string;
  effective_until: string | null;
  created_by: Pick<User, "id" | "name"> | null;
}

/**
 * A bundle of services sold as one item. Duration and `services_total` are
 * derived from the member services; `price` is the salon's single adjustable
 * package price (append-only ledger), which may differ from that total.
 */
export interface Package {
  id: number;
  category_id: number | null;
  category?: ServiceCategory | null;
  /** Routes the package to a public page: "maintenance" | "glorious" | "bridal". */
  collection: string | null;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  /** Site path (e.g. /images/GLORIOUS-PACKAGES-01.webp) or full URL. */
  image: string | null;
  /** The "what you get" bullets. */
  includes: string[];
  not_included: string | null;
  best_for: string | null;
  is_featured: boolean;
  is_active: boolean;
  /** Summed duration of the bundled services (derived). */
  duration_minutes: number;
  /** Summed current price of the bundled services (derived, suggested total). */
  services_total: string;
  /** The salon's set package price — the active package_price_history row. */
  price: string;
  services: Service[];
}

/** A shop product. Wig units also carry their length / texture / colour spec. */
export interface Product {
  id: number;
  name: string;
  slug: string;
  /** Shop grouping, e.g. "Wigs". */
  category: string | null;
  description: string | null;
  image: string | null;
  gallery: string[];
  price: string;
  /** Shop filter tags, e.g. ["wavy", "new"]. */
  tags: string[];
  length: string | null;
  texture: string | null;
  color: string | null;
  /** Shown in the full-screen menu's Shop panel. */
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface PackagePriceHistoryEntry {
  id: number;
  package_id: number;
  price: string;
  effective_from: string;
  effective_until: string | null;
  created_by: Pick<User, "id" | "name"> | null;
}

export interface WorkerSchedule {
  id: number;
  worker_profile_id: number;
  day_of_week: number; // 0 = Sunday … 6 = Saturday
  start_time: string; // "09:00"
  end_time: string; // "17:00"
  is_day_off: boolean;
}

export interface Worker {
  id: number; // user id
  name: string;
  avatar_url: string | null;
  is_active: boolean;
  profile: {
    id: number;
    bio: string | null;
    specialties: string[] | null;
    is_available: boolean;
  };
  schedules?: WorkerSchedule[];
  service_ids?: number[];
  rating_average?: number | null;
  reviews_count?: number;
}

export interface AvailabilitySlot {
  start: string; // ISO datetime
  end: string;
  /** Concrete worker auto-routed to this slot when "Any Specialist" was requested. */
  worker_id: number;
  worker_name: string;
}

export interface AppointmentLineItem {
  id: number;
  service_id: number;
  service_name: string;
  price_at_booking: string;
  price_by_consultation: boolean;
  duration_at_booking: number;
}

export interface Appointment {
  id: number;
  booking_reference: string;
  client: Pick<User, "id" | "name" | "email" | "phone">;
  worker: Pick<User, "id" | "name" | "avatar_url">;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  subtotal_amount: string;
  /** Member discount, applied before loyalty points. */
  member_discount_amount: string;
  loyalty_points_used: number;
  /** Loyalty-points discount. */
  discount_amount: string;
  total_amount: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: AppointmentStatus;
  notes: string | null;
  services: AppointmentLineItem[];
  review?: Review | null;
  created_at: string;
}

export interface BookingPayload {
  service_ids: number[];
  /** null = "Any Specialist" — backend auto-routes to the first free qualified worker. */
  worker_id: number | null;
  start_time: string;
  payment_method: PaymentMethod;
  loyalty_points_used: number;
  notes?: string;
}

export interface LoyaltyBalance {
  balance: number;
  /** True on scoped guest-sessions: saved points exist but are unredeemable. */
  locked?: boolean;
  /** Dollars of discount per point, admin-configured (e.g. "0.10"). */
  conversion_rate: string;
  points_per_booking: number;
  shoutout_bonus_points: number;
}

export interface LoyaltyTransaction {
  id: number;
  amount: number;
  type: LoyaltyTransactionType;
  description: string;
  created_at: string;
}

export interface LoyaltySettings {
  conversion_rate: string;
  points_per_booking: number;
  shoutout_bonus_points: number;
}

export interface ShoutoutClaim {
  id: number;
  user: Pick<User, "id" | "name" | "email">;
  proof_url: string;
  platform: string;
  status: ShoutoutStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  appointment_id: number;
  client: Pick<User, "id" | "name">;
  worker_id: number;
  rating: number;
  comment: string | null;
  is_published: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  subject_id: number;
  causer: Pick<User, "id" | "name" | "email"> | null;
  properties: {
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
  } | null;
  ip_address: string | null;
  created_at: string;
}

/* ---------------------------------- Analytics --------------------------------- */

export type RevenueGranularity = "daily" | "weekly" | "monthly" | "yearly";

export interface RevenuePoint {
  period: string;
  revenue: number;
}

export interface AppointmentVolumePoint {
  period: string;
  completed: number;
  cancelled: number;
  no_show: number;
}

export interface WorkerUtilizationPoint {
  worker_id: number;
  worker_name: string;
  booked_hours: number;
  available_hours: number;
  utilization_pct: number;
}

export interface LoyaltyEconomyPoint {
  period: string;
  issued: number;
  redeemed: number;
}

export interface WorkerMetrics {
  rating_average: number | null;
  reviews_count: number;
  reviews: Review[];
}

/* --------------------------------- Pagination --------------------------------- */

/** A client as the admin Clients tab sees them. */
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_guest: boolean;
  is_member: boolean;
  membership_since: string | null;
  membership_ends_at: string | null;
  appointments_count: number;
  created_at: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AuditLogFilters {
  causer_id?: number;
  log_name?: string;
  event?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
}

export interface AppointmentFilters {
  from?: string;
  to?: string;
  worker_id?: number;
  client_id?: number;
  status?: AppointmentStatus;
  page?: number;
}
