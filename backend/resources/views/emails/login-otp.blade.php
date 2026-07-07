<x-mail::message>
# Your sign-in code

Hi {{ $user->name }}, use this code to continue at October Glory:

<x-mail::panel>
<span style="font-size: 32px; letter-spacing: 8px; font-weight: bold;">{{ $code }}</span>
</x-mail::panel>

The code expires in {{ $ttlMinutes }} minutes. If you didn't request it, you can safely ignore this email — nobody can access your account with your email address alone.

It's your time to shine,<br>
October Glory
</x-mail::message>
