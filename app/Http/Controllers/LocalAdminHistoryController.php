<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocalAdminHistoryController extends Controller
{
    private const ALLOWED_ACTIONS = [
        'Connexion',
        'Déconnexion',
        'Consultation',
        'Confirmation',
        'Rejet',
        'Modification',
    ];

    public function __construct(
        private AuditLogService $auditLogService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);
        $agencyId = $user->agency_id;

        $agencyUserIds = User::where('agency_id', $agencyId)
            ->pluck('id')
            ->toArray();

        $query = AuditLog::whereIn('user_id', $agencyUserIds)
            ->whereIn('action', self::ALLOWED_ACTIONS)
            ->with('user.role');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        if ($request->filled('period') && $request->period !== 'all') {
            $query->where('created_at', '>=', match ($request->period) {
                'today' => now()->startOfDay(),
                '7days' => now()->subDays(7),
                '30days' => now()->subDays(30),
                default => now()->subDays(30),
            });
        }

        $query->orderBy('created_at', 'desc');

        $logs = $query->paginate(12)->withQueryString();

        $allAgency = AuditLog::whereIn('user_id', $agencyUserIds)
            ->whereIn('action', self::ALLOWED_ACTIONS);

        $stats = [
            'total' => (clone $allAgency)->count(),
            'today' => (clone $allAgency)->where('created_at', '>=', now()->startOfDay())->count(),
            'validations' => (clone $allAgency)->where('action', 'Confirmation')->count(),
            'refus' => (clone $allAgency)->where('action', 'Rejet')->count(),
        ];

        $actions = AuditLog::whereIn('user_id', $agencyUserIds)
            ->whereIn('action', self::ALLOWED_ACTIONS)
            ->distinct()
            ->pluck('action')
            ->filter()
            ->sort()
            ->values()
            ->toArray();

        return Inertia::render('Dashboard/LocalAdmin/History/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Administrateur Local',
                'agency' => $user->agency->name ?? '—',
            ],
            'logs' => $logs->getCollection()->map(
                fn ($log) => $this->auditLogService->serialize($log)
            )->toArray(),
            'pagination' => [
                'currentPage' => $logs->currentPage(),
                'lastPage' => $logs->lastPage(),
                'perPage' => $logs->perPage(),
                'total' => $logs->total(),
            ],
            'stats' => $stats,
            'actions' => $actions,
            'filters' => $request->only(['search', 'action', 'period']),
        ]);
    }
}
