<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Clear the catalog — every package, service and category — so the following
 * migrations can rebuild it from the website (Database\Seeders\SiteCatalog).
 *
 * Booking history is never destroyed: a service that appears on any
 * appointment can't be deleted (appointment_service is RESTRICT), so it is
 * deactivated and detached from its category instead, and its old bookings
 * keep pointing at it. Price ledgers, worker qualifications and package links
 * of deleted rows go with them (cascades); the services migration
 * re-qualifies workers for the new catalog.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            // Packages first: their price ledgers and service links cascade.
            DB::table('packages')->delete();

            $booked = DB::table('appointment_service')->distinct()->pluck('service_id');

            DB::table('services')->whereIn('id', $booked)->update([
                'is_active' => false,
                'category_id' => null,
                'slug' => null,
                'updated_at' => now(),
            ]);
            DB::table('services')->whereNotIn('id', $booked)->delete();

            DB::table('service_categories')->delete();
        });
    }

    /** The old catalog is not restored; roll forward with a new migration instead. */
    public function down(): void {}
};
