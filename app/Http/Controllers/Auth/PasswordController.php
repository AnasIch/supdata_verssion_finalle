<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class PasswordController extends Controller
{
    public function update()
    {
        return back()->with('status', 'Mot de passe mis à jour.');
    }
}
