<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkerSchedule extends Model
{
    use Auditable;

    protected $fillable = ['worker_profile_id', 'day_of_week', 'start_time', 'end_time', 'is_day_off'];

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
            'is_day_off' => 'boolean',
        ];
    }

    public function workerProfile(): BelongsTo
    {
        return $this->belongsTo(WorkerProfile::class);
    }
}
