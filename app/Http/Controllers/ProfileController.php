<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\ChangePasswordRequest;
use App\Services\NotificationService;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(
        private NotificationService $notificationService,
        private AuditLogService $auditLogService,
    ) {}
    public function index()
    {
        $user = Auth::user();
        $user->load(['role', 'agency']);

        return Inertia::render('Profile/Index', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'role' => $user->role->name ?? '—',
                'agency' => $user->agency->city ?? '—',
                'status' => $user->status,
                'created_at' => $user->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'last_login_at' => $user->last_login_at
                    ? $user->last_login_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm')
                    : null,
                'must_change_password' => $user->must_change_password,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function update(UpdateProfileRequest $request)
    {
        $user = Auth::user();

        $user->update([
            'name' => $request->validated('name'),
            'phone' => $request->validated('phone'),
        ]);

        return back()->with('success', 'Profil mis à jour avec succès.');
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $user = Auth::user();

        if (!Hash::check($request->validated('current_password'), $user->password)) {
            return back()->withErrors([
                'current_password' => 'Le mot de passe actuel est incorrect.',
            ]);
        }

        $user->update([
            'password' => Hash::make($request->validated('new_password')),
            'must_change_password' => false,
        ]);

        $this->notificationService->create(
            $user,
            'Mot de passe modifié',
            'Votre mot de passe a été modifié avec succès.',
            'success',
            'system',
        );

        $this->auditLogService->log(
            user: $user,
            action: 'Modification',
            module: 'Système',
            description: 'Modification du mot de passe',
            target: $user->email,
            newValues: ['mot_de_passe' => 'Modifié'],
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        return redirect()->route('profile')->with('success', 'Mot de passe modifié avec succès.');
    }
}
