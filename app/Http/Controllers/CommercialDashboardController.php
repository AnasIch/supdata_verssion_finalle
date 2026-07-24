<?php

namespace App\Http\Controllers;

use App\Services\CommercialDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommercialDashboardController extends Controller
{
    public function __construct(
        private CommercialDashboardService $dashboardService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->load(['role', 'agency']);
        }

        $userId = $user?->id;

        $stats = $userId
            ? $this->dashboardService->getStats($user)
            : [
                'totalDemandes' => 0,
                'pendingDemandes' => 0,
                'approvedDemandes' => 0,
                'rejectedDemandes' => 0,
                'inProgressDemandes' => 0,
                'completedDemandes' => 0,
                'totalEstimatedCost' => 0,
                'unreadNotifications' => 0,
            ];

        $evolution = $userId
            ? $this->dashboardService->getMonthlyDemandesEvolution($user)
            : [];

        $activity = $userId
            ? $this->dashboardService->getRecentActivity($user)
            : [];

        return Inertia::render('Dashboard/Commercial/Index', [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Responsable Commercial',
                'agency' => $user->agency->name ?? '—',
            ] : null,
            'stats' => $stats,
            'evolution' => $evolution,
            'activity' => $activity,
        ]);
    }
}
