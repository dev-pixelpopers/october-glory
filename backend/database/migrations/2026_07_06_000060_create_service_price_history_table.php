<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_price_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->timestamp('effective_from');
            $table->timestamp('effective_until')->nullable(); // null => currently active price
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['service_id', 'effective_from', 'effective_until'], 'sph_service_effective_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_price_history');
    }
};
