<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worker_services', function (Blueprint $table) {
            $table->foreignId('worker_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();

            $table->primary(['worker_profile_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worker_services');
    }
};
