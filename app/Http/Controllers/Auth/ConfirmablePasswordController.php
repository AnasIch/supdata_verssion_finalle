<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ConfirmablePasswordController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Login');
    }

    public function store()
    {
        return redirect()->intended();
    }
}
