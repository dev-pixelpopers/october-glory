<?php

namespace App\Models\Concerns;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Centralized audit logging: every insert, update and delete on a model
 * using this trait produces an audit_logs row with an old/new value diff,
 * the causing user, and the request IP.
 */
trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            static::writeAudit($model, 'created', [], $model->getAttributes());
        });

        static::updated(function (Model $model) {
            $old = array_intersect_key($model->getOriginal(), $model->getChanges());
            $new = $model->getChanges();
            unset($old['updated_at'], $new['updated_at']);

            if ($new !== []) {
                static::writeAudit($model, 'updated', $old, $new);
            }
        });

        static::deleted(function (Model $model) {
            static::writeAudit($model, 'deleted', $model->getOriginal(), []);
        });
    }

    protected static function writeAudit(Model $model, string $event, array $old, array $new): void
    {
        // Never persist secrets into the audit trail.
        foreach (['password', 'remember_token'] as $secret) {
            unset($old[$secret], $new[$secret]);
        }

        AuditLog::query()->create([
            'log_name' => $model->auditLogName ?? str(class_basename($model))->snake()->toString(),
            'description' => sprintf('%s %s #%s', ucfirst($event), str(class_basename($model))->headline()->lower(), $model->getKey()),
            'subject_type' => $model->getMorphClass(),
            'subject_id' => $model->getKey(),
            'causer_type' => Auth::user()?->getMorphClass(),
            'causer_id' => Auth::id(),
            'properties' => ['old_values' => $old, 'new_values' => $new],
            'ip_address' => request()?->ip(),
        ]);
    }
}
