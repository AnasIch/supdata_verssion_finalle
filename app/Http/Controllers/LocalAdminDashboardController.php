<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Services\DemandeStatisticsService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LocalAdminDashboardController extends Controller
{
    public function __construct(
        private NotificationService $notificationService,
        private DemandeStatisticsService $demandeStatisticsService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $stats = $this->demandeStatisticsService->getDashboardStats();
        $decisionsData = $this->buildDecisionsData($stats);
        $evolutionData = $this->getEvolutionData();
        $lastDemandes = $this->demandeStatisticsService->getRecentDemandes(5);
        $recentNotifications = $this->notificationService->getRecentForDropdown($user, 5);
        $unreadNotifications = $user->notifications()->whereNull('read_at')->count();
        $quickActions = $this->getQuickActions();

        return Inertia::render('Dashboard/LocalAdmin/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Administrateur Local',
                'agency' => $user->agency->name ?? '—',
                'agency_id' => $user->agency_id,
            ],
            'stats' => $stats,
            'evolutionData' => $evolutionData,
            'decisionsData' => $decisionsData,
            'lastDemandes' => $lastDemandes,
            'recentNotifications' => $recentNotifications,
            'unreadNotifications' => $unreadNotifications,
            'quickActions' => $quickActions,
        ]);
    }

    private function getQuickActions(): array
    {
        return [
            ['label' => 'Voir les demandes', 'color' => 'bg-blue-50 text-blue-600 hover:bg-blue-100'],
            ['label' => 'Consulter le stock', 'color' => 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'],
            ['label' => 'Historique', 'color' => 'bg-amber-50 text-amber-600 hover:bg-amber-100'],
            ['label' => 'Rapports', 'color' => 'bg-violet-50 text-violet-600 hover:bg-violet-100'],
        ];
    }

    private function buildDecisionsData(array $stats): array
    {
        return [
            ['name' => 'En attente', 'value' => $stats['pendingLocalAdmin'], 'color' => '#f59e0b'],
            ['name' => 'Confirmées', 'value' => $stats['confirmedLocalAdmin'], 'color' => '#10b981'],
            ['name' => 'Rejetées', 'value' => $stats['rejectedLocalAdmin'], 'color' => '#ef4444'],
        ];
    }

    private function getEvolutionData(): array
    {
        $months = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->push([
                'mois' => $date->locale('fr')->isoFormat('MMM'),
                'month_key' => $date->format('Y-m'),
            ]);
        }

        $monthExpression = DB::getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        $demandes = Demande::whereIn('status', DemandeStatisticsService::ADMIN_LOCAL_STATUSES)
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->select(
                DB::raw("{$monthExpression} as month_key"),
                DB::raw('COUNT(*) as creees'),
                DB::raw("SUM(CASE WHEN status = 'confirmed_local_admin' THEN 1 ELSE 0 END) as confirmees"),
                DB::raw("SUM(CASE WHEN status = 'rejected_local_admin' THEN 1 ELSE 0 END) as rejetees")
            )
            ->groupBy('month_key')
            ->get()
            ->keyBy('month_key');

        return $months->map(fn ($m) => [
            'mois' => $m['mois'],
            'creees' => (int) ($demandes[$m['month_key']]['creees'] ?? 0),
            'confirmees' => (int) ($demandes[$m['month_key']]['confirmees'] ?? 0),
            'rejetees' => (int) ($demandes[$m['month_key']]['rejetees'] ?? 0),
        ])->values()->toArray();
    }
}
