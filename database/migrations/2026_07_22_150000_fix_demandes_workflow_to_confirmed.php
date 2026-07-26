<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE demandes SET status = 'approved' WHERE status IN ('preparing', 'shipped')");

        Schema::table('demandes', function (Blueprint $table) {
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('confirmed_at')->nullable();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'in_progress', 'completed', 'confirmed') DEFAULT 'pending'");
        }

        Schema::table('demandes', function (Blueprint $table) {
            $table->dropForeign(['prepared_by']);
            $table->dropForeign(['shipped_by']);
            $table->dropColumn(['prepared_by', 'prepared_at', 'shipped_by', 'shipped_at']);
        });
    }

    public function down(): void
    {
        Schema::table('demandes', function (Blueprint $table) {
            $table->foreignId('prepared_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('prepared_at')->nullable();
            $table->foreignId('shipped_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('shipped_at')->nullable();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'in_progress', 'completed', 'preparing', 'shipped') DEFAULT 'pending'");
        }

        Schema::table('demandes', function (Blueprint $table) {
            $table->dropForeign(['confirmed_by']);
            $table->dropColumn(['confirmed_by', 'confirmed_at']);
        });
    }
};
