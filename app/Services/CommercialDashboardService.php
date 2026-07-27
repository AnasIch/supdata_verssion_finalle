<?php

namespace App\Services;

use App\Models\User;
use App\Models\Demande;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;

class CommercialDashboardService
{
    public function getStats(User $user): array
    {
        $totalDemandes = Demande::where('user_id', $user->id)->count();
        $pendingDemandes = Demande::where('user_id', $user->id)->where('status', 'submitted')->count();
        $approvedDemandes = Demande::where('user_id', $user->id)->whereIn('status', ['pending_local_admin', 'confirmed_local_admin'])->count();
        $rejectedDemandes = Demande::where('user_id', $user->id)->whereIn('status', ['rejected', 'rejected_local_admin'])->count();
        $inProgressDemandes = Demande::where('user_id', $user->id)->where('status', 'in_progress')->count();
        $completedDemandes = Demande::where('user_id', $user->id)->where('status', 'completed')->count();
        $unreadNotifications = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', User::class)
            ->whereNull('read_at')
            ->count();

        return [
            'totalDemandes' => $totalDemandes,
            'pendingDemandes' => $pendingDemandes,
            'approvedDemandes' => $approvedDemandes,
            'rejectedDemandes' => $rejectedDemandes,
            'inProgressDemandes' => $inProgressDemandes,
            'completedDemandes' => $completedDemandes,
            'unreadNotifications' => $unreadNotifications,
        ];
    }

    public function getMonthlyDemandesEvolution(User $user): array
    {
        $data = Demande::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('count(*) as total'),
                DB::raw("sum(case when status in ('confirmed_local_admin','completed') then 1 else 0 end) as validees"),
                DB::raw("sum(case when status in ('rejected','rejected_local_admin') then 1 else 0 end) as refusees")
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return $data->map(fn ($row) => [
            'mois' => \Carbon\Carbon::parse($row->month . '-01')->isoFormat('MMM'),
            'demandes' => (int) $row->total,
            'validees' => (int) $row->validees,
            'refusees' => (int) $row->refusees,
        ])->toArray();
    }

    public function getRecentActivity(User $user): array
    {
        $logs = AuditLog::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $typeMap = [
            'Création' => 'demande',
            'Modification' => 'demande',
            'Suppression' => 'refus',
            'Connexion' => 'validation',
        ];

        return $logs->map(fn ($log) => [
            'id' => $log->id,
            'type' => $typeMap[$log->action] ?? 'demande',
            'text' => $log->action,
            'detail' => $log->description . ($log->target ? ' — ' . $log->target : ''),
            'time' => $log->created_at->locale('fr')->diffForHumans(),
        ])->toArray();
    }
}
