<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Store an admin-uploaded image on the public disk and return its URL,
     * which the dashboard then saves on a service, product or worker exactly
     * like a pasted image URL. Served via `php artisan storage:link`.
     */
    public function image(UploadImageRequest $request): JsonResponse
    {
        $folder = $request->validated('folder', 'uploads');
        $path = $request->file('image')->store("images/{$folder}", 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
