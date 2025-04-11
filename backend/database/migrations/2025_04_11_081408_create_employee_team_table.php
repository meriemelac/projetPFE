<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeeTeamTable extends Migration
{
    public function up(): void
    {
        Schema::create('employee_team', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['employee_id', 'team_id']); // éviter les doublons
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_team');
    }
}
