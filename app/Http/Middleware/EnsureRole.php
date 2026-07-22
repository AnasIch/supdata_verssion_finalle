<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    private const SLUG_MAP = [
        'super_admin' => 'Super Admin',
        'admin_local' => 'Administrateur Local',
        'gestion_administrative' => 'Gestion Administrative',
        'responsable_commercial' => 'Responsable Commercial',
        'responsable_stock' => 'Responsable Stock',
    ];

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $userRole = $user->role->name ?? null;

        $resolvedRoles = array_map(fn (string $r) => self::SLUG_MAP[$r] ?? $r, $roles);

        if (!in_array($userRole, $resolvedRoles)) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}
