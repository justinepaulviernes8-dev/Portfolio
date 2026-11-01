<?php

return [
    'auth_required' => env('PORTFOLIO_AUTH_REQUIRED', !in_array(env('APP_ENV', 'production'), ['local', 'testing'])),
    'owner_email' => env('PORTFOLIO_OWNER_EMAIL'),
    'owner_password_hash' => env('PORTFOLIO_OWNER_PASSWORD_HASH'),
    'upload_disk' => env('PROJECT_UPLOAD_DISK', 'public'),
];
