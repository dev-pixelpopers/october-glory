<x-mail::message>
# You're booked, {{ $appointment->client->name }}!

Your appointment at **October Glory** is confirmed.

**Reference:** {{ $appointment->booking_reference }}<br>
**When:** {{ $appointment->start_time->format('l, F j, Y \a\t g:i A') }} – {{ $appointment->end_time->format('g:i A') }}<br>
**Specialist:** {{ $appointment->worker->name }}

## Services
@foreach ($appointment->lineItems as $item)
- {{ $item->service?->name }} — ${{ $item->price_at_booking }}
@endforeach

@if ((float) $appointment->discount_amount > 0)
Loyalty discount: −${{ $appointment->discount_amount }} ({{ $appointment->loyalty_points_used }} points)
@endif

**Total: ${{ $appointment->total_amount }}** ({{ $appointment->payment_method === 'card' ? 'Card' : 'Pay upon arrival' }})

A calendar invite is attached — see you soon!

It's your time to shine,<br>
October Glory
</x-mail::message>
