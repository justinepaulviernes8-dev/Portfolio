<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OwnerSessionController;
use App\Http\Middleware\RequirePortfolioOwner;

Route::get('/', PortfolioController::class)->name('portfolio');

// Laravel's file response supports byte ranges so video seeking also works locally.
Route::get('/media/profile-video', function () {
    return response()->file(public_path('videos/profile-video.mp4'), [
        'Content-Type' => 'video/mp4',
    ]);
})->name('profile-video');

Route::get('/login', [OwnerSessionController::class, 'create'])->name('login');
Route::post('/login', [OwnerSessionController::class, 'store'])->middleware('throttle:5,1');
Route::post('/logout', [OwnerSessionController::class, 'destroy'])->name('logout');
Route::resource('projects', ProjectController::class)->except('show')->middleware(RequirePortfolioOwner::class);
