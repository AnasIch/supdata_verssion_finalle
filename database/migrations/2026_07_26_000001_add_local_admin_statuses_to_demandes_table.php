<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'pending_local_admin', 'confirmed_local_admin', 'rejected', 'rejected_local_admin', 'approved', 'confirmed', 'in_progress', 'completed') DEFAULT 'pending'");
        }

        DB::statement("UPDATE demandes SET status = 'pending_local_admin' WHERE status = 'approved'");
        DB::statement("UPDATE demandes SET status = 'confirmed_local_admin' WHERE status = 'confirmed'");

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'pending_local_admin', 'confirmed_local_admin', 'rejected', 'rejected_local_admin', 'in_progress', 'completed') DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        DB::statement("UPDATE demandes SET status = 'approved' WHERE status = 'pending_local_admin'");
        DB::statement("UPDATE demandes SET status = 'confirmed' WHERE status = 'confirmed_local_admin'");
        DB::statement("UPDATE demandes SET status = 'rejected' WHERE status = 'rejected_local_admin'");

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'in_progress', 'completed', 'confirmed') DEFAULT 'pending'");
        }
    }
};
