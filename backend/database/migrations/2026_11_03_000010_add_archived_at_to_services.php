<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Set when the dashboard deletes a service that is on past appointments.
 * Booking history must keep pointing at it (appointment_service is RESTRICT),
 * so it is archived — hidden from every listing — rather than removed.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->timestamp('archived_at')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('archived_at');
        });
    }
};
