<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_profile_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week'); // 0 = Sunday … 6 = Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_day_off')->default(false);
            $table->timestamps();

            $table->index(['worker_profile_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_schedules');
    }
};
