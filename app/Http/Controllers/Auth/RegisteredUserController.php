<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return redirect()->route('login');
    }

    public function store()
    {
        return redirect()->route('login');
    }
}
