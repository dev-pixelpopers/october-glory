<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 32)->unique();
            $table->foreignId('client_id')->constrained('users');
            $table->foreignId('worker_id')->constrained('users');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->unsignedInteger('total_duration_minutes');
            $table->decimal('subtotal_amount', 10, 2);
            $table->unsignedInteger('loyalty_points_used')->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_method', ['card', 'pay_upon_arrival']);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('status', [
                'scheduled', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show',
            ])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Critical composite index for overlap checks under pessimistic locking.
            $table->index(['worker_id', 'start_time', 'end_time', 'status'], 'appt_worker_window_idx');
            $table->index(['client_id', 'start_time']);
            $table->index(['start_time', 'end_time', 'status'], 'appt_salon_window_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
