<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Preserve the displayed sequence when converting legacy zero-based orders.
        if (DB::table('projects')->where('display_order', '<', 1)->exists()) {
            $ids = DB::table('projects')->orderBy('display_order')->orderBy('id')->pluck('id');
            if ($ids->count() > 100) throw new RuntimeException('Cannot fit existing projects into display orders 1–100.');
            DB::transaction(function () use ($ids) {
                foreach ($ids as $index => $id) DB::table('projects')->where('id', $id)->update(['display_order' => $index + 1]);
            });
        }
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedInteger('display_order')->default(1)->change();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedInteger('display_order')->default(0)->change();
        });
    }
};
