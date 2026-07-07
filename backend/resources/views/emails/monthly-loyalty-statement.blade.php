<x-mail::message>
# Your monthly loyalty statement

Hi {{ $user->name }}, here's your October Glory rewards recap for the last 30 days:

| | Points |
|---|---|
| Earned | +{{ $earned }} |
| Redeemed | −{{ $redeemed }} |
| **Current balance** | **{{ $balance }}** |

Redeem your points for discounts on your next visit.

It's your time to shine,<br>
October Glory
</x-mail::message>
