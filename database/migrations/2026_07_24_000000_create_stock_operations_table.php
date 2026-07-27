<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_operations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('section');
            $table->string('name');
            $table->text('detail')->nullable();
            $table->foreignId('agency_id')->nullable()->constrained('agences')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('quantity')->default(0);
            $table->string('status')->default('En cours');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['section', 'status']);
            $table->index(['agency_id', 'section']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_operations');
    }
};
