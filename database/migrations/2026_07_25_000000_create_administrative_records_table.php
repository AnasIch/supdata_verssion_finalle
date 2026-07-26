<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('administrative_records', function (Blueprint $table) {
            $table->id(); $table->string('type', 30)->index(); $table->string('reference')->unique();
            $table->string('title'); $table->text('description')->nullable(); $table->string('status')->default('Brouillon');
            $table->foreignId('agency_id')->nullable()->constrained('agences')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('effective_at')->nullable(); $table->date('expires_at')->nullable(); $table->json('metadata')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('administrative_records'); }
};
