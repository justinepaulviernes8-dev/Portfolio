<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', PortfolioController::class)->name('portfolio');

// Local review and classroom demo. Add authentication before public deployment.
Route::resource('projects', ProjectController::class)->except('show');
