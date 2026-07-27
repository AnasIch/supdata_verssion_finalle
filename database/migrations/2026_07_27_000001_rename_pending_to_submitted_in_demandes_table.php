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
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'submitted', 'pending_local_admin', 'confirmed_local_admin', 'rejected', 'rejected_local_admin', 'in_progress', 'completed') DEFAULT 'submitted'");
        }

        DB::statement("UPDATE demandes SET status = 'submitted' WHERE status = 'pending'");

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('submitted', 'pending_local_admin', 'confirmed_local_admin', 'rejected', 'rejected_local_admin', 'in_progress', 'completed') DEFAULT 'submitted'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('submitted', 'pending', 'pending_local_admin', 'confirmed_local_admin', 'rejected', 'rejected_local_admin', 'in_progress', 'completed') DEFAULT 'pending'");
        }

        DB::statement("UPDATE demandes SET status = 'pending' WHERE status = 'submitted'");

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE demandes MODIFY COLUMN status ENUM('pending', 'pending_local_admin', 'confirmed_local_admin', 'rejected', 'rejected_local_admin', 'in_progress', 'completed') DEFAULT 'pending'");
        }
    }
};
