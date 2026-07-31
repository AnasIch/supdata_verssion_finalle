<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_operations', function (Blueprint $table) {
            $table->string('document_type')->nullable();
            $table->string('document_path')->nullable();
            $table->string('original_file_name')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('stock_operations', function (Blueprint $table) {
            $table->dropColumn(['document_type', 'document_path', 'original_file_name']);
        });
    }
};
