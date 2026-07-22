<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Product;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LocalAdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);
        $agencyId = $user->agency_id;

        $stats = $this->getStats($agencyId);
        $evolutionData = $this->getEvolutionData($agencyId);
        $decisionsData = $this->getDecisionsData($agencyId);
        $pendingDemandes = $this->getPendingDemandes($agencyId);
        $recentActivity = $this->getRecentActivity($user);
        $importantNotifications = $this->getImportantNotifications($user);

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
            'pendingDemandes' => $pendingDemandes,
            'recentActivity' => $recentActivity,
            'importantNotifications' => $importantNotifications,
            'unreadNotifications' => $user->notifications()->whereNull('read_at')->count(),
        ]);
    }

    private function getStats(int $agencyId): array
    {
        $demandesQuery = Demande::where('agency_id', $agencyId);

        return [
            'pendingDemandes' => (clone $demandesQuery)->where('status', 'pending')->count(),
            'approvedDemandes' => (clone $demandesQuery)->where('status', 'approved')->count(),
            'rejectedDemandes' => (clone $demandesQuery)->where('status', 'rejected')->count(),
            'completedDemandes' => (clone $demandesQuery)->where('status', 'completed')->count(),
            'totalDemandes' => (clone $demandesQuery)->count(),
            'totalProducts' => Product::where('agency_id', $agencyId)->count(),
            'lowStockProducts' => Product::where('agency_id', $agencyId)
                ->whereRaw('quantity_in_stock <= minimum_stock')->count(),
            'totalStockValue' => (float) Product::where('agency_id', $agencyId)
                ->sum(DB::raw('unit_price * quantity_in_stock')),
        ];
    }

    private function getEvolutionData(int $agencyId): array
    {
        $months = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months->push([
                'mois' => $date->locale('fr')->isoFormat('MMM'),
                'month_key' => $date->format('Y-m'),
            ]);
        }

        $demandes = Demande::where('agency_id', $agencyId)
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key"),
                DB::raw('count(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved"),
                DB::raw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected")
            )
            ->groupBy('month_key')
            ->get()
            ->keyBy('month_key');

        return $months->map(fn ($m) => [
            'mois' => $m['mois'],
            'demandes' => $demandes[$m['month_key']]['total'] ?? 0,
            'validees' => $demandes[$m['month_key']]['approved'] ?? 0,
            'refusees' => $demandes[$m['month_key']]['rejected'] ?? 0,
        ])->values()->toArray();
    }

    private function getDecisionsData(int $agencyId): array
    {
        $counts = Demande::where('agency_id', $agencyId)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            ['name' => 'Validées', 'value' => $counts['approved'] ?? 0, 'color' => '#10b981'],
            ['name' => 'En attente', 'value' => $counts['pending'] ?? 0, 'color' => '#f59e0b'],
            ['name' => 'Refusées', 'value' => $counts['rejected'] ?? 0, 'color' => '#ef4444'],
            ['name' => 'Annulées', 'value' => ($counts['in_progress'] ?? 0) + ($counts['completed'] ?? 0), 'color' => '#94a3b8'],
        ];
    }

    private function getPendingDemandes(int $agencyId): array
    {
        return Demande::where('agency_id', $agencyId)
            ->where('status', 'pending')
            ->with('user')
            ->latest()
            ->get()
            ->map(fn ($d) => [
                'id' => 'DEM-' . $d->created_at->format('Y') . '-' . str_pad($d->id, 4, '0', STR_PAD_LEFT),
                'responsable' => $d->user->name ?? '—',
                'client' => $d->product_name ?? $d->title,
                'priorite' => $this->mapPriority($d->priority),
                'budget' => number_format($d->quantity, 0, ',', ' '),
                'date' => $d->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'statut' => 'En attente',
            ])
            ->toArray();
    }

    private function getRecentActivity($user): array
    {
        $agencyUserIds = $user->agency->users()->pluck('users.id')->toArray();

        $logs = AuditLog::whereIn('user_id', $agencyUserIds)
            ->with('user')
            ->latest()
            ->take(10)
            ->get();

        if ($logs->isEmpty()) {
            $logs = AuditLog::with('user')->latest()->take(10)->get();
        }

        return $logs->map(fn ($log) => [
            'id' => $log->id,
            'type' => $this->mapActivityType($log->action),
            'text' => $log->action,
            'detail' => $log->description . ($log->target ? ' — ' . $log->target : ''),
            'time' => $log->created_at->locale('fr')->diffForHumans(),
            'color' => $this->mapActivityColor($log->action),
        ])->toArray();
    }

    private function getImportantNotifications($user): array
    {
        return $user->notifications()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'type' => $n->data['type'] ?? 'info',
                'title' => $n->data['title'] ?? '',
                'description' => $n->data['description'] ?? '',
                'time' => $n->created_at->locale('fr')->diffForHumans(),
                'badge' => $this->mapNotificationBadge($n->data['type'] ?? 'info'),
            ])
            ->toArray();
    }

    private function mapPriority(string $priority): string
    {
        return match ($priority) {
            'high' => 'Haute',
            'medium' => 'Moyenne',
            'low' => 'Basse',
            'urgent' => 'Urgente',
            default => ucfirst($priority),
        };
    }

    private function mapActivityType(string $action): string
    {
        $lower = strtolower($action);
        if (str_contains($lower, 'connexion')) return 'connexion';
        if (str_contains($lower, 'cr')) return 'demande';
        if (str_contains($lower, 'modification')) return 'validation';
        if (str_contains($lower, 'suppression')) return 'notification';
        return 'consultation';
    }

    private function mapActivityColor(string $action): string
    {
        $type = $this->mapActivityType($action);
        return match ($type) {
            'demande' => 'bg-amber-50 text-amber-600',
            'validation' => 'bg-emerald-50 text-emerald-600',
            'consultation' => 'bg-blue-50 text-blue-600',
            'notification' => 'bg-violet-50 text-violet-600',
            'connexion' => 'bg-slate-100 text-slate-600',
            default => 'bg-slate-100 text-slate-600',
        };
    }

    private function mapNotificationBadge(string $type): string
    {
        return match ($type) {
            'warning' => 'Critique',
            'success' => 'Validé',
            'info' => 'Info',
            default => 'Nouveau',
        };
    }
}
