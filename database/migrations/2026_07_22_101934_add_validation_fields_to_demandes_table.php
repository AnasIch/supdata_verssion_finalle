<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('demandes', function (Blueprint $table) {
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('validated_at')->nullable();
            $table->text('refusal_reason')->nullable();
            $table->foreignId('refused_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('refused_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('demandes', function (Blueprint $table) {
            $table->dropForeign(['validated_by']);
            $table->dropForeign(['refused_by']);
            $table->dropColumn(['validated_by', 'validated_at', 'refusal_reason', 'refused_by', 'refused_at']);
        });
    }
};
