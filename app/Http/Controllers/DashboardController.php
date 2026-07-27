<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Agency;
use App\Models\Product;
use App\Models\Demande;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->load(['role', 'agency']);
        }

        // Global stats
        $stats = [
            'users' => User::count(),
            'agencies' => Agency::count(),
            'products' => Product::count(),
            'demandes' => Demande::count(),
            'activeProducts' => Product::where('status', 'active')->count(),
            'pendingDemandes' => Demande::where('status', 'submitted')->count(),
            'approvedDemandes' => Demande::where('status', 'confirmed_local_admin')->count(),
            'completedDemandes' => Demande::where('status', 'completed')->count(),
            'rejectedDemandes' => Demande::where('status', 'rejected')->count(),
            'inProgressDemandes' => Demande::where('status', 'in_progress')->count(),
            'totalStockValue' => Product::sum(\DB::raw('unit_price * quantity_in_stock')),
            'lowStockProducts' => Product::whereRaw('quantity_in_stock <= minimum_stock')->count(),
        ];

        // Recent users (last 5)
        $recentUsers = User::with(['role', 'agency'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role->name ?? '—',
                'agency' => $u->agency->name ?? '—',
                'status' => $u->status,
                'created_at' => $u->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
            ]);

        // Recent demandes (last 5)
        $recentDemandes = Demande::with(['user', 'agency'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'title' => $d->title,
                'status' => $d->status,
                'priority' => $d->priority,
                'quantity' => $d->quantity,
                'user' => $d->user->name ?? '—',
                'agency' => $d->agency->name ?? '—',
                'created_at' => $d->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
            ]);

        // Agency stats
        $agencyStats = Agency::withCount(['users', 'products'])
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'name' => $a->name,
                'users_count' => $a->users_count,
                'products_count' => $a->products_count,
                'total_stock_value' => Product::where('agency_id', $a->id)->sum(\DB::raw('unit_price * quantity_in_stock')),
            ]);

        // Recent activity (last 10 audit logs)
        $recentActivity = AuditLog::with('user')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'user' => $log->user->name ?? 'Système',
                'action' => $log->action,
                'module' => $log->module,
                'description' => $log->description,
                'target' => $log->target,
                'status' => $log->status,
                'created_at' => $log->created_at->locale('fr')->isoFormat('DD MMM YYYY, HH:mm'),
            ]);

        // Chart data: demandes by status
        $demandesByStatus = Demande::select('status', \DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->pluck('total', 'status')
            ->toArray();

        // Chart data: products by category
        $productsByCategory = Product::select('category', \DB::raw('count(*) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        // Chart data: monthly demandes trend (last 6 months)
        $monthlyDemandes = Demande::where('created_at', '>=', now()->subMonths(6))
            ->select(\DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), \DB::raw('count(*) as total'))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();

        // Chart data: demandes by priority
        $demandesByPriority = Demande::select('priority', \DB::raw('count(*) as total'))
            ->groupBy('priority')
            ->get()
            ->pluck('total', 'priority')
            ->toArray();

        return Inertia::render('Dashboard/SuperAdmin/Index', [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Super Admin',
            ] : ['name' => 'Super Admin', 'email' => 'admin@supdata.com', 'role' => 'Super Admin'],
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentDemandes' => $recentDemandes,
            'agencyStats' => $agencyStats,
            'recentActivity' => $recentActivity,
            'charts' => [
                'demandesByStatus' => $demandesByStatus,
                'productsByCategory' => $productsByCategory,
                'monthlyDemandes' => $monthlyDemandes,
                'demandesByPriority' => $demandesByPriority,
            ],
        ]);
    }
}
