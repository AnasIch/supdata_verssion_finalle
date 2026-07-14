<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

class EmailVerificationNotificationController extends Controller
{
    public function store()
    {
        return back()->with('status', 'Un nouveau lien de vérification a été envoyé.');
    }
}
