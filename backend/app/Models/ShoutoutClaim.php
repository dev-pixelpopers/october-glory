<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShoutoutClaim extends Model
{
    use Auditable;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = ['user_id', 'proof_url', 'platform', 'status', 'admin_notes', 'reviewed_by'];

    // Mirrors the DB column default so a freshly created (unsaved-refresh)
    // model already reports "pending" in API responses.
    protected $attributes = ['status' => self::STATUS_PENDING];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
