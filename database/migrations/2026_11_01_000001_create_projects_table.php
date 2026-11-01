<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 120)->unique();
            $table->string('category', 60);
            $table->text('description');
            $table->text('details');
            $table->string('tech_stack', 200);
            $table->string('image_path');
            $table->string('image_alt', 255);
            $table->string('image_fit', 10)->default('cover');
            $table->unsignedInteger('display_order')->default(0)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
