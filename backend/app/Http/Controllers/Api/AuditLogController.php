<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AuditLogController extends Controller
{
    /** Searchable, filterable system audit trail for the admin viewer. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $logs = AuditLog::query()
            ->with('causer')
            ->when($request->query('causer_id'), fn ($q, $id) => $q->where('causer_id', $id))
            ->when($request->query('log_name'), fn ($q, $name) => $q->where('log_name', $name))
            ->when($request->query('event'), fn ($q, $event) => $q->where('description', 'like', ucfirst($event).'%'))
            ->when($request->query('from'), fn ($q, $from) => $q->where('created_at', '>=', $from))
            ->when($request->query('to'), fn ($q, $to) => $q->where('created_at', '<=', $to.' 23:59:59'))
            ->when($request->query('search'), fn ($q, $term) => $q->where('description', 'like', "%{$term}%"))
            ->latest('created_at')
            ->latest('id')
            ->paginate(25);

        return AuditLogResource::collection($logs);
    }
}
