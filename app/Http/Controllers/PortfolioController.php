<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Portfolio', [
            'projects' => Project::orderBy('display_order')->orderBy('id')->get(),
        ]);
    }
}
