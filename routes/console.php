<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('portfolio:password-hash', function () {
    $password = $this->secret('Choose an owner password (at least 12 characters)');
    if (!is_string($password) || strlen($password) < 12) {
        $this->error('Use at least 12 characters.');
        return 1;
    }
    if ($password !== $this->secret('Confirm password')) {
        $this->error('Passwords did not match.');
        return 1;
    }
    $this->line(\Illuminate\Support\Facades\Hash::make($password));
    $this->info('Paste this hash into PORTFOLIO_OWNER_PASSWORD_HASH in Vercel. Keep the password private.');
})->purpose('Generate a hash for the private portfolio owner login');
