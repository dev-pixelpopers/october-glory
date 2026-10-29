<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Members get a percentage off every booking (30% by default).
 *
 * - appointments.member_discount_amount snapshots the member discount, kept
 *   apart from discount_amount (loyalty points) so both show on the receipt.
 * - The rate lives in settings so it can change without a deploy.
 * - A default membership plan is created so admins can mark clients as
 *   members; its price is a placeholder until the salon sets one.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->decimal('member_discount_amount', 10, 2)->default(0)->after('subtotal_amount');
        });

        if (! DB::table('settings')->where('key', 'membership.discount_rate')->exists()) {
            DB::table('settings')->insert([
                'key' => 'membership.discount_rate',
                'value' => '0.30',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if (! DB::table('memberships')->exists()) {
            DB::table('memberships')->insert([
                'name' => 'Glory Membership',
                'price' => 0,
                'billing_cycle' => 'monthly',
                'benefits' => json_encode(['30% off every service', 'Priority booking', 'Loyalty points on everything']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('member_discount_amount');
        });
        DB::table('settings')->where('key', 'membership.discount_rate')->delete();
    }
};
