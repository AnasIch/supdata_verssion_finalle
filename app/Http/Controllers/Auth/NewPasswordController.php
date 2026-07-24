<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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

    public function store(ResetPasswordRequest $request)
    {
        $validated = $request->validated();

        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (!$record || !Hash::check($validated['token'], $record->token)) {
            return back()->withErrors([
                'email' => 'Le lien de réinitialisation est invalide ou a expiré.',
            ]);
        }

        $tokenCreatedAt = Carbon::parse($record->created_at);
        if ($tokenCreatedAt->diffInMinutes(now()) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $validated['email'])
                ->delete();

            return back()->withErrors([
                'email' => 'Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.',
            ]);
        }

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Aucun compte trouvé avec cette adresse email.',
            ]);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->delete();

        return redirect()->route('login')->with('status', 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.');
    }
}
