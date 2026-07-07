# October Glory — Salon Booking & Management System

Headless **Laravel 13 API** (`backend/`) + **Next.js 16 App Router** frontend (`src/`).

## Running locally

```bash
# API (http://localhost:8000) — requires PHP 8.3 + Composer
cd backend
php artisan migrate:fresh --seed
php artisan storage:link   # once — serves uploaded shoutout screenshots
php artisan serve

# Queue worker (delayed review emails, confirmations; mail logs to storage/logs)
php artisan queue:work

# Scheduler (monthly loyalty statements — 1st @ 00:00)
php artisan schedule:work

# Frontend (http://localhost:3000)
npm run dev
```

> **Windows note:** PHP extensions are enabled through a user-local ini at
> `C:\Users\Tommy\.php\php.ini` (the `PHPRC` user env var points there), because
> `C:\Program Files\PHP\current\php.ini` isn't writable without elevation.

## Seeded accounts (password: `password`)

| Role   | Email                        |
|--------|------------------------------|
| Admin  | admin@octoberglory.com       |
| Worker | jhavuanna@octoberglory.com   |
| Worker | maya@octoberglory.com        |
| Worker | simone@octoberglory.com      |
| Client | client@example.com           |

## Key surfaces

- `/booking` — 5-step wizard: multi-select services → qualified specialist (or "Any") → live availability → checkout with loyalty slider + card / pay-upon-arrival → confirmation with reference.
  - **Checkout auth:** signed-in users pass through; everyone else picks "Continue as Guest" (name/email/phone, **instant — no OTP**) or full sign-in via `POST /api/auth/guest-session`:
    - Unknown email → passwordless `is_guest` account + full token.
    - Existing guest → immediate sign-in (name/phone refreshed).
    - Existing **full** account → immediate **scoped guest session** (Sanctum token ability `guest`, `session_scope: "guest"`): booking works, but saved loyalty points are locked/hidden (`/loyalty/balance` returns `balance: 0, locked: true`), appointment history is limited to bookings made during the session, reviews/shoutouts are blocked, and role-gated endpoints reject the token even for admin/worker emails (`EnsureRole` requires `tokenCan('full')`). Password sign-in restores everything.
  - Guests can still convert via `POST /api/auth/set-password` (confirmation-screen + dashboard banners).
- **Registration requires email OTP:** `POST /api/auth/register` creates the account unverified (`is_active = false`, `email_verified_at = null` — converting an existing guest in place) and queues a 6-digit code (15-min TTL, `SendRegistrationOtpMail`); it returns 201 **without a token**. `POST /api/auth/verify-otp` (`email` + `otp_code`) activates the account (`is_guest = false`) and issues the token; `POST /api/auth/resend-otp` (throttled, generic response) re-sends. Logging in with a correct password on an unverified account returns 423 + a fresh code. The frontend transitions the register form into a 6-slot OTP view with a 60s resend countdown.
- `/login` — standalone sign-in page with an "OR — **Continue as Guest**" option (name + email → instant session → redirected to `/booking`); also handles register + OTP modes. Sign-out from any dashboard redirects here even if the token was already invalidated. A passwordless guest at `/login` gets a 423 + emailed login code instead of being blocked.
- `/dashboard` — role-routed, with a **collapsible sidebar** (icon rail on desktop, slide-over sheet under 1024px) and a **dashboard-scoped light/dark toggle** persisted to `localStorage("dashboard-theme")` — the public site theme is untouched.
  - **Admin:** Recharts analytics (revenue, volume, utilization, loyalty economy), master calendar, service catalog with price-history timeline, worker management (hours, qualified services), loyalty settings, shoutout approval queue, audit-log viewer with JSON diffs.
  - **Worker:** day/week schedule with live status controls (check-in → in-progress → complete / no-show), rating + feedback list.
  - **Client:** appointments (cancel ≥24h ahead, review completed visits), loyalty ledger + shoutout screenshot upload (drag-and-drop, 5 MB png/jpg/webp → `POST /api/shoutout-claims` multipart → `storage/app/public/shoutouts`, served via `php artisan storage:link`), membership placeholder, profile with guest→password conversion.

## Architecture invariants

- **Prices are append-only:** changes close the active `service_price_history` row (`effective_until = now()`) and open a new one; appointment line items snapshot price/duration at booking.
- **Concurrency:** booking runs in a `DB::transaction` with `lockForUpdate()` on the worker's overlapping rows; salon-wide capacity is derived live from active scheduled workers (never hardcoded).
- **Loyalty is a pure ledger:** balance = `SUM(amount)` over `loyalty_transactions`.
- **Audit:** every insert/update/delete on domain models writes `audit_logs` (old/new values, causer, IP) via the `Auditable` trait.

## Tests

```bash
cd backend && php artisan test   # BookingFlowTest covers booking, locking, loyalty, pricing, RBAC
```
