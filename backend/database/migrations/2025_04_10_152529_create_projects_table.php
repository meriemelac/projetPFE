<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjectsTable extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['En cours', 'Terminé'])->default('En cours');
            $table->date('start_date');
            $table->date('end_date');
            $table->foreignId('manager_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('employees')->onDelete('cascade');
            $table->unsignedBigInteger('team_id')->nullable(); // Pas de contrainte pour le moment
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
}
