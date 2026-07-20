<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class AuditLogService
{
    public function log(
        ?User $user,
        string $action,
        string $module,
        string $description,
        ?string $target = null,
        string $status = 'Succès',
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ipAddress = null,
        ?string $userAgent = null,
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'target' => $target,
            'status' => $status,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'old_values' => $oldValues,
            'new_values' => $newValues,
        ]);
    }

    public function getPaginated(Request $request): LengthAwarePaginator
    {
        $query = AuditLog::with('user.role');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('target', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('module')) {
            $query->where('module', $request->module);
        }

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('user_filter')) {
            $query->where('user_id', $request->user_filter);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        if ($request->filled('period')) {
            $query->where('created_at', '>=', match ($request->period) {
                'today' => now()->startOfDay(),
                '7days' => now()->subDays(7),
                '30days' => now()->subDays(30),
                'year' => now()->startOfYear(),
                default => now()->subDays(30),
            });
        }

        $sortDirection = $request->get('sort', 'desc');

        $query->orderBy('created_at', $sortDirection);

        return $query->paginate(12);
    }

    public function getStats(): array
    {
        $all = AuditLog::query();

        $today = (clone $all)->where('created_at', '>=', now()->startOfDay())->count();
        $total = (clone $all)->count();
        $successCount = (clone $all)->where('status', 'Succès')->count();
        $failedCount = (clone $all)->where('status', 'Échoué')->count();

        return [
            'total' => $total,
            'today' => $today,
            'success' => $successCount,
            'failed' => $failedCount,
        ];
    }

    public function getModules(): array
    {
        return AuditLog::distinct()->pluck('module')->filter()->values()->toArray();
    }

    public function getActions(): array
    {
        return AuditLog::distinct()->pluck('action')->filter()->values()->toArray();
    }

    public function getAllUsers(): array
    {
        return User::has('auditLogs')
            ->with('role')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->role?->name ?? '—',
            ])
            ->toArray();
    }

    public function serialize(AuditLog $log): array
    {
        return [
            'id' => $log->id,
            'timestamp' => $log->created_at->format('d/m/Y H:i:s'),
            'user' => $log->user?->name ?? 'Système',
            'email' => $log->user?->email ?? '—',
            'role' => $log->user?->role?->name ?? '—',
            'action' => $log->action,
            'module' => $log->module,
            'description' => $log->description,
            'target' => $log->target ?? '—',
            'ip' => $log->ip_address ?? '—',
            'device' => $log->user_agent ?? '—',
            'status' => $log->status,
            'agency' => $log->user?->agency?->city ?? '—',
            'details' => [
                'ancien' => $log->old_values,
                'nouveau' => $log->new_values,
            ],
        ];
    }
}
