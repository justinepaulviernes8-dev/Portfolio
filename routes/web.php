<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', PortfolioController::class)->name('portfolio');

// Laravel's file response supports byte ranges so video seeking also works locally.
Route::get('/media/profile-video', function () {
    return response()->file(public_path('videos/profile-video.mp4'), [
        'Content-Type' => 'video/mp4',
    ]);
})->name('profile-video');

// Local review and classroom demo. Add authentication before public deployment.
Route::resource('projects', ProjectController::class)->except('show');
