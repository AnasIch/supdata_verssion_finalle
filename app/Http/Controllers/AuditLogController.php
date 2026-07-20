<?php

namespace App\Http\Controllers;

use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function __construct(
        private AuditLogService $auditLogService,
    ) {}

    public function index(Request $request)
    {
        $paginator = $this->auditLogService->getPaginated($request);
        $stats = $this->auditLogService->getStats();
        $modules = $this->auditLogService->getModules();
        $actions = $this->auditLogService->getActions();
        $users = $this->auditLogService->getAllUsers();

        return Inertia::render('Dashboard/AuditLogs/Index', [
            'logs' => $paginator->getCollection()->map(
                fn ($log) => $this->auditLogService->serialize($log)
            )->toArray(),
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'stats' => $stats,
            'modules' => $modules,
            'actions' => $actions,
            'users' => $users,
            'filters' => $request->only(['search', 'module', 'action', 'user_filter', 'period', 'sort']),
        ]);
    }
}
