<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('category_thresholds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agences')->cascadeOnDelete();
            $table->string('category');
            $table->unsignedInteger('minimum_stock')->default(0);
            $table->unsignedInteger('maximum_stock')->nullable();
            $table->timestamps();

            $table->unique(['agency_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_thresholds');
    }
};
