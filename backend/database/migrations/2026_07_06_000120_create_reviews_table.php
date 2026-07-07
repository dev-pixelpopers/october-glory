<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users');
            $table->foreignId('worker_id')->constrained('users');
            $table->unsignedTinyInteger('rating'); // 1 – 5
            $table->text('comment')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['worker_id', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
