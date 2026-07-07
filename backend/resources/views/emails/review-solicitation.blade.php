<x-mail::message>
# How did we do, {{ $appointment->client->name }}?

Thanks for visiting October Glory! We'd love to hear about your session with **{{ $appointment->worker->name }}**.

<x-mail::button :url="$reviewUrl">
Leave A Review
</x-mail::button>

It only takes a minute — and it helps {{ $appointment->worker->name }} shine.

It's your time to shine,<br>
October Glory
</x-mail::message>
