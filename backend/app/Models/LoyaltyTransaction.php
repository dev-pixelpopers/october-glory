<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyTransaction extends Model
{
    use Auditable;

    public const TYPE_BOOKING_REWARD = 'booking_reward';
    public const TYPE_SHOUTOUT_BONUS = 'shoutout_bonus';
    public const TYPE_REDEMPTION = 'redemption';
    public const TYPE_ADMIN_ADJUSTMENT = 'admin_adjustment';
    public const TYPE_EXPIRATION = 'expiration';

    protected string $auditLogName = 'loyalty';

    protected $fillable = ['user_id', 'amount', 'type', 'reference_type', 'reference_id', 'description'];

    protected function casts(): array
    {
        return ['amount' => 'integer'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
