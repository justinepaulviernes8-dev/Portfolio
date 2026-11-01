<?php

namespace App\Support;

use Illuminate\Http\Request;

class OwnerAccess
{
    public static function required(): bool
    {
        return !app()->environment(['local', 'testing']) || (bool) config('portfolio.auth_required');
    }

    public static function fingerprint(): string
    {
        return hash('sha256', config('portfolio.owner_email').'|'.config('portfolio.owner_password_hash'));
    }

    public static function canManage(Request $request): bool
    {
        if (!self::required()) return true;

        return filled(config('portfolio.owner_email')) && filled(config('portfolio.owner_password_hash'))
            && hash_equals(self::fingerprint(), (string) $request->session()->get('portfolio_owner', ''));
    }
}
