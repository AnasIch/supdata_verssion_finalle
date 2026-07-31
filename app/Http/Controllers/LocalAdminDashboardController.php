<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Models\Demande;
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
        $lastDemandes = $this->getLastDemandes($agencyId);
        $unreadNotifications = $user->notifications()->whereNull('read_at')->count();

        $capacities = Agency::orderBy('name')->get()->map(fn ($agency) => [
            'id' => $agency->id,
            'name' => $agency->name,
            'capacity' => $agency->storage_capacity,
            'used' => (int) $agency->products()->sum('quantity_in_stock'),
        ])->values();

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
            'unreadNotifications' => $unreadNotifications,
            'capacities' => $capacities,
        ]);
    }

    private function getStats(int $agencyId): array
    {
        return [
            'pendingLocalAdmin' => Demande::where('agency_id', $agencyId)->whereIn('status', ['submitted', 'pending_local_admin'])->count(),
            'confirmedLocalAdmin' => Demande::where('agency_id', $agencyId)->where('status', 'confirmed_local_admin')->count(),
            'rejectedLocalAdmin' => Demande::where('agency_id', $agencyId)->where('status', 'rejected_local_admin')->count(),
            'totalProcessed' => Demande::where('agency_id', $agencyId)->whereIn('status', ['confirmed_local_admin', 'rejected_local_admin'])->count(),
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

        $monthExpression = DB::getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        $demandes = Demande::where('agency_id', $agencyId)
            ->whereIn('status', ['submitted', 'pending_local_admin', 'confirmed_local_admin', 'rejected_local_admin'])
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->select(
                DB::raw("{$monthExpression} as month_key"),
                DB::raw("SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted"),
                DB::raw("SUM(CASE WHEN status = 'confirmed_local_admin' THEN 1 ELSE 0 END) as confirmed"),
                DB::raw("SUM(CASE WHEN status = 'rejected_local_admin' THEN 1 ELSE 0 END) as rejected")
            )
            ->groupBy('month_key')
            ->get()
            ->keyBy('month_key');

        return $months->map(fn ($m) => [
            'mois' => $m['mois'],
            'nouvelles' => $demandes[$m['month_key']]['submitted'] ?? 0,
            'confirmees' => $demandes[$m['month_key']]['confirmed'] ?? 0,
            'rejetees' => $demandes[$m['month_key']]['rejected'] ?? 0,
        ])->values()->toArray();
    }

    private function getDecisionsData(int $agencyId): array
    {
        $counts = Demande::where('agency_id', $agencyId)
            ->whereIn('status', ['submitted', 'pending_local_admin', 'confirmed_local_admin', 'rejected_local_admin'])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        return [
            ['name' => 'Nouvelles', 'value' => $counts['submitted'] ?? 0, 'color' => '#3b82f6'],
            ['name' => 'En attente', 'value' => $counts['pending_local_admin'] ?? 0, 'color' => '#f59e0b'],
            ['name' => 'Confirmées', 'value' => $counts['confirmed_local_admin'] ?? 0, 'color' => '#10b981'],
            ['name' => 'Rejetées', 'value' => $counts['rejected_local_admin'] ?? 0, 'color' => '#ef4444'],
        ];
    }

    private function getLastDemandes(int $agencyId): array
    {
        return Demande::where('agency_id', $agencyId)
            ->whereIn('status', ['submitted', 'pending_local_admin', 'confirmed_local_admin', 'rejected_local_admin'])
            ->with(['user', 'agency'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'reference' => 'DEM-' . $d->created_at->format('Y') . '-' . str_pad($d->id, 4, '0', STR_PAD_LEFT),
                'product' => $d->product_name ?? $d->title,
                'requester' => $d->user?->name ?? '—',
                'agency' => $d->agency?->name ?? '—',
                'date' => $d->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'status' => $this->mapStatus($d->status),
            ])
            ->toArray();
    }

    private function mapStatus(string $status): string
    {
        return match ($status) {
            'submitted' => 'Soumise',
            'pending_local_admin' => 'En attente',
            'confirmed_local_admin' => 'Confirmée',
            'rejected_local_admin' => 'Rejetée',
            default => ucfirst($status),
        };
    }
}
