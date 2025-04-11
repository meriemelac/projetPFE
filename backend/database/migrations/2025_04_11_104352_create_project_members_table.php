<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectMembersTable extends Migration
{
    public function up(): void
    {
        Schema::create('project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('role')->nullable(); // rôle spécifique dans le projet
            $table->timestamps();

            $table->unique(['employee_id', 'project_id']); // empêche les doublons
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_members');
    }
}
