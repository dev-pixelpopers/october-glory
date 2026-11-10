<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Order lifecycle: pending, processing, shipped, delivered, cancelled
            $table->string('status')->default('pending');

            // Payment tracking
            $table->string('payment_status')->default('paid');
            $table->string('payment_method')->default('card');

            // Customer details
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');

            // Shipping address
            $table->string('shipping_address_line1');
            $table->string('shipping_address_line2')->nullable();
            $table->string('shipping_city');
            $table->string('shipping_state');
            $table->string('shipping_postal_code');
            $table->string('shipping_country')->default('United States');
            $table->string('shipping_method')->default('standard');
            $table->decimal('shipping_cost', 10, 2)->default(0.00);

            // Financial breakdown
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0.00);
            $table->decimal('total', 10, 2);

            // Additional details
            $table->text('notes')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();

            // Snapshot product details at purchase time
            $table->string('product_name');
            $table->string('product_slug')->nullable();
            $table->string('product_image')->nullable();
            $table->string('variant_id')->nullable();

            $table->decimal('unit_price', 10, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('line_total', 10, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
