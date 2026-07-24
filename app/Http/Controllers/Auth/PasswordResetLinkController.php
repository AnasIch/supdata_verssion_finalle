<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(ForgotPasswordRequest $request)
    {
        $email = $request->validated('email');

        $user = \App\Models\User::where('email', $email)->first();

        if (!$user) {
            return back()->with('status', 'Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.');
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        $resetUrl = route('password.reset', [
            'token' => $token,
            'email' => $email,
        ]);

        try {
            Mail::to($email)->send(new ResetPasswordMail($email, $resetUrl));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Erreur envoi email réinitialisation: {$e->getMessage()}");
        }

        return back()->with('status', 'Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.');
    }
}
