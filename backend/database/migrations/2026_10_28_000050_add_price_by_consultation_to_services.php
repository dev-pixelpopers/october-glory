<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Quoted after the stylist's consultation (e.g. custom wig units).
            // The ledger holds 0.00 so it adds nothing to a booking's total.
            $table->boolean('price_by_consultation')->default(false)->after('duration_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('price_by_consultation');
        });
    }
};
