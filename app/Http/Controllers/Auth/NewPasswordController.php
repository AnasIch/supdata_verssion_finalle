<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class NewPasswordController extends Controller
{
    public function create($token)
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => request()->query('email', ''),
        ]);
    }

    public function store()
    {
        return redirect()->route('login')->with('status', 'Mot de passe réinitialisé.');
    }
}
