<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'shipping' => [
                'address_line1' => $this->shipping_address_line1,
                'address_line2' => $this->shipping_address_line2,
                'city' => $this->shipping_city,
                'state' => $this->shipping_state,
                'postal_code' => $this->shipping_postal_code,
                'country' => $this->shipping_country,
                'method' => $this->shipping_method,
                'cost' => (float) $this->shipping_cost,
                'tracking_number' => $this->tracking_number,
                'shipped_at' => $this->shipped_at?->toISOString(),
                'delivered_at' => $this->delivered_at?->toISOString(),
            ],
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'name' => $item->product_name,
                    'slug' => $item->product_slug,
                    'image' => $item->product_image,
                    'variant_id' => $item->variant_id,
                    'unit_price' => (float) $item->unit_price,
                    'quantity' => (int) $item->quantity,
                    'line_total' => (float) $item->line_total,
                ];
            }),
            'pricing' => [
                'subtotal' => (float) $this->subtotal,
                'tax' => (float) $this->tax,
                'shipping' => (float) $this->shipping_cost,
                'total' => (float) $this->total,
            ],
            'total_items' => $this->items->sum('quantity'),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
