<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuestSessionRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\SetPasswordRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** Abilities granted to password-verified (or brand-new guest) sessions. */
    protected const FULL_ABILITIES = ['*'];

    /** Abilities for a guest-session issued to an existing full account. */
    protected const GUEST_ABILITIES = ['guest'];

    public function __construct(protected OtpService $otp) {}

    /**
     * Full account sign-up. The account is created unverified and inactive;
     * a queued 6-digit code proves email ownership before any token exists.
     * An existing guest account with the same email is converted in place.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $guest = User::query()
            ->where('email', $data['email'])
            ->where('is_guest', true)
            ->first();

        if ($guest) {
            $guest->update([
                'name' => $data['name'],
                'password' => $data['password'],
                'phone' => $data['phone'] ?? $guest->phone,
                'is_active' => false,
                'email_verified_at' => null,
            ]);
            $user = $guest;
        } else {
            $user = User::query()->create([
                ...$data,
                'role' => User::ROLE_CLIENT,
                'is_active' => false,
                'email_verified_at' => null,
            ]);
        }

        $this->otp->send($user, OtpService::PURPOSE_REGISTER);

        return response()->json([
            'requires_verification' => true,
            'email' => $user->email,
            'message' => "We sent a 6-digit code to {$user->email}. Enter it below to activate your account.",
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()->where('email', $request->validated('email'))->first();

        // Passwordless guests are never blocked here: email them a code.
        if ($user && $user->password === null && $user->is_active) {
            $this->otp->send($user, OtpService::PURPOSE_LOGIN);

            return response()->json([
                'guest_otp_sent' => true,
                'requires_verification' => true,
                'email' => $user->email,
                'message' => "You previously booked as a guest. We've sent a code to set your password.",
            ], 423);
        }

        if (! $user || $user->password === null || ! Hash::check($request->validated('password'), (string) $user->password)) {
            throw ValidationException::withMessages(['email' => 'These credentials do not match our records.']);
        }

        // Correct password but the registration OTP was never completed.
        if (! $user->is_active && $user->email_verified_at === null) {
            $this->otp->send($user, OtpService::PURPOSE_REGISTER);

            return response()->json([
                'requires_verification' => true,
                'email' => $user->email,
                'message' => "Your account isn't verified yet. We sent a fresh 6-digit code to {$user->email}.",
            ], 423);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages(['email' => 'This account has been deactivated.']);
        }

        return $this->tokenResponse($user);
    }

    /**
     * Frictionless "Continue as Guest" — name + email only, no OTP.
     *
     * - Unknown email:            create a passwordless guest, full session.
     * - Existing guest account:   sign straight in, full session.
     * - Existing FULL account:    sign in immediately but on an ability-scoped
     *   token that can book appointments yet cannot redeem loyalty points,
     *   view historical appointments, or reach role-gated endpoints — those
     *   require the standard password route.
     */
    public function guestSession(GuestSessionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = User::query()->where('email', $data['email'])->first();

        if (! $user) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => null,
                'role' => User::ROLE_CLIENT,
                'is_guest' => true,
            ]);

            return $this->tokenResponse($user, self::FULL_ABILITIES, 201);
        }

        if (! $user->is_active) {
            throw ValidationException::withMessages(['email' => 'This account cannot be used right now.']);
        }

        if ($user->is_guest) {
            // Returning guest: refresh contact details, sign in immediately.
            $user->update([
                'name' => $data['name'],
                'phone' => $data['phone'] ?? $user->phone,
            ]);

            return $this->tokenResponse($user, self::FULL_ABILITIES);
        }

        // Full registered account: scoped guest session.
        return $this->tokenResponse($user, self::GUEST_ABILITIES);
    }

    /**
     * Exchange an emailed 6-digit code for an authenticated session.
     * Serves registration activation first, then passwordless guest login.
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $email = $request->validated('email');
        $code = $request->validated('otp_code');
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            throw ValidationException::withMessages(['otp_code' => 'That code is invalid or has expired.']);
        }

        if ($this->otp->verify($email, $code, OtpService::PURPOSE_REGISTER)) {
            $user->forceFill([
                'email_verified_at' => now(),
                'is_guest' => false,
                'is_active' => true,
            ])->save();

            return $this->tokenResponse($user);
        }

        if ($user->is_active && $this->otp->verify($email, $code, OtpService::PURPOSE_LOGIN)) {
            if ($user->email_verified_at === null) {
                $user->forceFill(['email_verified_at' => now()])->save();
            }

            return $this->tokenResponse($user);
        }

        throw ValidationException::withMessages(['otp_code' => 'That code is invalid or has expired.']);
    }

    /** Re-send the appropriate code. Response is generic to avoid email enumeration. */
    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        $user = User::query()->where('email', $request->input('email'))->first();

        if ($user && $user->email_verified_at === null && $user->password !== null) {
            $this->otp->send($user, OtpService::PURPOSE_REGISTER);
        } elseif ($user && $user->password === null && $user->is_active) {
            $this->otp->send($user, OtpService::PURPOSE_LOGIN);
        }

        return response()->json(['message' => 'If that email is pending verification, a new code is on its way.']);
    }

    /** Progressive conversion: guest sets a password and becomes a full user. */
    public function setPassword(SetPasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($user->hasFullSession(), 403, 'Sign in with your password to manage this account.');

        $user->update([
            'password' => $request->validated('password'),
            'is_guest' => false,
        ]);

        return response()->json(['user' => new UserResource($user->fresh())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'data' => new UserResource($user),
            'session_scope' => $user->hasFullSession() ? 'full' : 'guest',
        ]);
    }

    protected function tokenResponse(User $user, array $abilities = self::FULL_ABILITIES, int $status = 200): JsonResponse
    {
        return response()->json([
            'token' => $user->createToken('spa', $abilities)->plainTextToken,
            'user' => new UserResource($user),
            'session_scope' => $abilities === self::GUEST_ABILITIES ? 'guest' : 'full',
        ], $status);
    }
}
