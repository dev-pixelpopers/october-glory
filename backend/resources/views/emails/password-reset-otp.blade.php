<x-mail::message>
# Reset your password

Hi {{ $user->name }}, use this code to choose a new password for your October Glory account:

<x-mail::panel>
<span style="font-size: 32px; letter-spacing: 8px; font-weight: bold;">{{ $code }}</span>
</x-mail::panel>

The code expires in {{ $ttlMinutes }} minutes. If you didn't request a password reset, you can safely ignore this email — your password stays unchanged.

It's your time to shine,<br>
October Glory
</x-mail::message>
