<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    /**
     * Store an admin-uploaded video on the public disk and return its URL.
     */
    public function video(Request $request): JsonResponse
    {
        $request->validate([
            'video' => ['required', 'file', 'mimes:mp4,mov,webm,ogg,quicktime', 'max:51200'],
            'folder' => ['sometimes', 'string', 'in:services,products,packages,categories,workers,uploads'],
        ], [
            'video.uploaded' => 'The video could not be received — it may be larger than the server accepts. Please try one under 50 MB.',
        ]);

        $folder = $request->input('folder', 'products');
        $path = $request->file('video')->store("videos/{$folder}", 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
