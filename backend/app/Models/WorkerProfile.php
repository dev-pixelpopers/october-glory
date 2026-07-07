<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkerProfile extends Model
{
    use Auditable;

    protected $fillable = ['user_id', 'bio', 'specialties', 'is_available'];

    protected function casts(): array
    {
        return [
            'specialties' => 'array',
            'is_available' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(WorkerSchedule::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'worker_services');
    }
}
