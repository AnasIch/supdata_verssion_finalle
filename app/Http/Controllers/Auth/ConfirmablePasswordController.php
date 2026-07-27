<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ConfirmablePasswordController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    public function store(Request $request)
    {
        $request->validate(['password' => ['required', 'string']]);
        if (! Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors(['password' => 'Le mot de passe est incorrect.']);
        }
        $request->session()->put('auth.password_confirmed_at', time());
        return redirect()->intended(route('dashboard', absolute: false));
    }
}
