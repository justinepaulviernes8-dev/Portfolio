<?php

namespace App\Http\Controllers;

use App\Support\OwnerAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class OwnerSessionController extends Controller
{
    public function create(Request $request)
    {
        if (OwnerAccess::canManage($request)) return to_route('projects.index');
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $hash = config('portfolio.owner_password_hash');
        if (!filled($hash) || !filled(config('portfolio.owner_email'))
            || !Hash::check($data['password'], $hash)
            || strcasecmp($data['email'], config('portfolio.owner_email')) !== 0) {
            throw ValidationException::withMessages(['email' => 'The login details are incorrect.']);
        }
        $request->session()->regenerate();
        $request->session()->put('portfolio_owner', OwnerAccess::fingerprint());
        return redirect()->intended(route('projects.index'));
    }

    public function destroy(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return to_route('portfolio');
    }
}
