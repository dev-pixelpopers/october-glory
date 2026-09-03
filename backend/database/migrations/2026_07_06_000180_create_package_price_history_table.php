<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('package_price_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->timestamp('effective_from');
            $table->timestamp('effective_until')->nullable(); // null => currently active price
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['package_id', 'effective_from', 'effective_until'], 'pph_package_effective_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_price_history');
    }
};
