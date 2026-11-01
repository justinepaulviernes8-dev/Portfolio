<?php

// Fail clearly without displaying any credential values.
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

if (!$app->environment('production')) throw new RuntimeException('Set APP_ENV=production for the online container.');

$missing = [];
foreach (['APP_KEY', 'APP_URL', 'DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD',
    'PORTFOLIO_OWNER_EMAIL', 'PORTFOLIO_OWNER_PASSWORD_HASH', 'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 'AWS_DEFAULT_REGION', 'AWS_BUCKET', 'AWS_URL'] as $name) {
    if (!filled(env($name))) $missing[] = $name;
}
if ($missing) throw new RuntimeException('Configure these Vercel environment variables: '.implode(', ', $missing));
if (!filter_var(config('portfolio.owner_email'), FILTER_VALIDATE_EMAIL)
    || password_get_info(config('portfolio.owner_password_hash'))['algoName'] !== 'bcrypt') {
    throw new RuntimeException('Configure a valid owner email and a bcrypt password hash from portfolio:password-hash.');
}
if (!str_starts_with(config('app.url'), 'https://')) throw new RuntimeException('APP_URL must use HTTPS.');
if (in_array(config('database.connections.'.config('database.default').'.host'), ['localhost', '127.0.0.1'])) {
    throw new RuntimeException('Use the hosted database, not the local XAMPP address.');
}
if (config('session.driver') !== 'database' || config('cache.default') !== 'database') {
    throw new RuntimeException('Use database sessions and cache for shared login sessions and rate limiting.');
}
if (config('portfolio.upload_disk') !== 's3') throw new RuntimeException('Use S3-compatible storage for durable project uploads.');
if (config('app.debug')) throw new RuntimeException('APP_DEBUG must be false online.');
