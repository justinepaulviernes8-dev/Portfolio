<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = json_decode(file_get_contents(database_path('seeders/data/projects.json')), true, flags: JSON_THROW_ON_ERROR);
        foreach ($projects as $project) {
            // Re-seeding does not overwrite existing records edited in the UI.
            Project::firstOrCreate(['title' => $project['title']], $project);
        }
    }
}
