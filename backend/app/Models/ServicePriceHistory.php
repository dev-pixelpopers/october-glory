<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicePriceHistory extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'service_price_history';

    protected $fillable = ['service_id', 'price', 'effective_from', 'effective_until', 'created_by'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'effective_from' => 'datetime',
            'effective_until' => 'datetime',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
