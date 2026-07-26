<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('demandes', function (Blueprint $table) {
                $table->string('status')->default('pending')->change();
            });
        }
    }

    public function down(): void
    {
        // MySQL retains its enum definition; SQLite intentionally keeps the
        // flexible string column to avoid losing valid workflow states.
    }
};
