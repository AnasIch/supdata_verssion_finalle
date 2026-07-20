<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuditLogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        private AuditLogService $auditLogService,
    ) {}

    public function create()
    {
        $user = auth()->user();

        return Inertia::render('Auth/Login', [
            'canResetPassword' => true,
            'status' => session('status'),
            'auth' => $user ? [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->name,
                ],
            ] : null,
        ]);
    }

    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        $this->auditLogService->log(
            user: $user,
            action: 'Connexion',
            module: 'Système',
            description: 'Connexion au système',
            target: null,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        if ($user->must_change_password) {
            return Redirect::route('profile');
        }

        return Redirect::to($this->dashboardPath($user->role->name));
    }

    public function destroy()
    {
        $user = Auth::user();

        if ($user) {
            $this->auditLogService->log(
                user: $user,
                action: 'Déconnexion',
                module: 'Système',
                description: 'Déconnexion du système',
                target: null,
                ipAddress: request()->ip(),
                userAgent: request()->userAgent(),
            );
        }

        Auth::logout();

        return Redirect::route('home');
    }

    private function dashboardPath(string $role): string
    {
        return match ($role) {
            'Super Admin' => '/dashboard-super-admin',
            'Administrateur Local' => '/dashboard-admin-local',
            'Gestion Administrative' => '/dashboard-administrative',
            'Responsable Commercial' => '/dashboard-commercial',
            'Responsable Stock' => '/dashboard-stock',
            default => '/dashboard-super-admin',
        };
    }
}
