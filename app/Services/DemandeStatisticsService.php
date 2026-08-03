<?php

namespace App\Services;

use App\Models\Demande;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DemandeStatisticsService
{
    public const ADMIN_LOCAL_STATUSES = [
        'submitted',
        'pending_local_admin',
        'confirmed_local_admin',
        'rejected_local_admin',
    ];

    public const ADMIN_LOCAL_PENDING_STATUSES = [
        'submitted',
        'pending_local_admin',
    ];

    /**
     * Source unique des demandes visibles par l'Administrateur Local.
     *
     * Mêmes statuts, mêmes filtres, même ordre pour le Dashboard
     * et la page « Gestion des demandes ».
     */
    public function adminLocalDemandesQuery(?Request $request = null): Builder
    {
        $query = Demande::whereIn('status', self::ADMIN_LOCAL_STATUSES);

        if ($request) {
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('product_name', 'like', "%{$search}%")
                      ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"));
                });
            }

            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->filled('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }
        }

        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Statistiques pour la page « Gestion des demandes ».
     */
    public function getAdminLocalStats(): array
    {
        $counts = Demande::whereIn('status', self::ADMIN_LOCAL_STATUSES)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $confirmed = (int) ($counts['confirmed_local_admin'] ?? 0);
        $rejected = (int) ($counts['rejected_local_admin'] ?? 0);

        return [
            'total' => array_sum($counts),
            'pending' => (int) ($counts['submitted'] ?? 0) + (int) ($counts['pending_local_admin'] ?? 0),
            'confirmed' => $confirmed,
            'rejected' => $rejected,
        ];
    }

    /**
     * Statistiques pour le Dashboard Administrateur Local.
     *
     * Dérivées exactement des mêmes données que getAdminLocalStats().
     */
    public function getDashboardStats(): array
    {
        $stats = $this->getAdminLocalStats();

        return [
            'pendingLocalAdmin' => $stats['pending'],
            'confirmedLocalAdmin' => $stats['confirmed'],
            'rejectedLocalAdmin' => $stats['rejected'],
            'totalProcessed' => $stats['confirmed'] + $stats['rejected'],
        ];
    }

    /**
     * Dernières demandes pour le Dashboard — mêmes demandes que
     * la page « Gestion des demandes », mêmes statuts et même ordre.
     */
    public function getRecentDemandes(int $limit = 5): array
    {
        return $this->adminLocalDemandesQuery()
            ->with(['user', 'agency'])
            ->take($limit)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'reference' => 'DEM-' . $d->created_at->format('Y') . '-' . str_pad($d->id, 4, '0', STR_PAD_LEFT),
                'product' => $d->product_name ?? $d->title,
                'requester' => $d->user?->name ?? '—',
                'agency' => $d->agency?->name ?? '—',
                'date' => $d->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'status' => $this->mapStatus($d->status),
                'priority' => $d->priority,
            ])
            ->toArray();
    }

    public function mapStatus(string $status): string
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
