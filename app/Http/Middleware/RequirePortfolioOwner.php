<?php

namespace App\Http\Middleware;

use App\Support\OwnerAccess;
use Closure;
use Illuminate\Http\Request;

class RequirePortfolioOwner
{
    public function handle(Request $request, Closure $next)
    {
        if (!OwnerAccess::canManage($request)) return redirect()->guest(route('login'));
        return $next($request);
    }
}
