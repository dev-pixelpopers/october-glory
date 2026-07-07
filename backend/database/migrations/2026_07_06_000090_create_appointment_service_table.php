<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained('services');
            // Immutable snapshots taken from the active service_price_history row at checkout.
            $table->decimal('price_at_booking', 10, 2);
            $table->unsignedInteger('duration_at_booking');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_service');
    }
};
