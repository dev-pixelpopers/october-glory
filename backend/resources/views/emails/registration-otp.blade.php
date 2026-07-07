<x-mail::message>
# Activate your account

Welcome to October Glory, {{ $user->name }}! Enter this code to verify your email and activate your account:

<x-mail::panel>
<span style="font-size: 32px; letter-spacing: 8px; font-weight: bold;">{{ $code }}</span>
</x-mail::panel>

The code expires in {{ $ttlMinutes }} minutes. If you didn't create an account, you can safely ignore this email.

It's your time to shine,<br>
October Glory
</x-mail::message>
