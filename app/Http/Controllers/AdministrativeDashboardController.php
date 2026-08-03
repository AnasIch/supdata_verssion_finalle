<?php

namespace App\Http\Controllers;

use App\Mail\NouvelleDemandeALMail;
use App\Models\Agency;
use App\Models\Demande;
use App\Models\Product;
use App\Models\User;
use App\Services\AuditLogService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdministrativeDashboardController extends Controller
{
    public function __construct(
        private AuditLogService $auditLogs,
        private NotificationService $notifications,
    ) {}

    public function index(Request $request)
    {
        $requests = Demande::with(['user', 'agency'])->createdByRole('Responsable Commercial')->latest()->get();
        $pending = $requests->where('status', 'submitted');
        $pendingLocal = $requests->where('status', 'pending_local_admin');
        $confirmedLocal = $requests->where('status', 'confirmed_local_admin');
        $rejected = $requests->where('status', 'rejected');

        return Inertia::render('Dashboard/Administrative/Index', [
            'user' => $this->userPayload($request),
            'dashboardData' => [
                'stats' => [
                    ['id' => 'review', 'label' => 'À vérifier', 'value' => $pending->count(), 'detail' => $pending->where('priority', 'urgent')->count() . ' urgentes'],
                    ['id' => 'approval', 'label' => 'Chez Admin local', 'value' => $pendingLocal->count(), 'detail' => 'en validation finale'],
                    ['id' => 'approved', 'label' => 'Demandes acceptées', 'value' => $confirmedLocal->count(), 'detail' => 'validations finales reçues'],
                    ['id' => 'processed', 'label' => 'Traitées', 'value' => $pendingLocal->count() + $confirmedLocal->count() + $rejected->count(), 'detail' => 'demandes traitées'],
                    ['id' => 'rejected', 'label' => 'Rejetées', 'value' => $rejected->count(), 'detail' => 'avec motif enregistré'],
                    ['id' => 'delay', 'label' => 'Délai moyen', 'value' => '—', 'detail' => 'calculé sur les dossiers'],
                ],
                'requests' => $pending->take(12)->map(fn ($d) => $this->dashboardRequest($d))->values(),
                'flow' => [
                    ['label' => 'Reçues', 'value' => $requests->count(), 'color' => '#2563eb'],
                    ['label' => 'Validées', 'value' => $pendingLocal->count() + $confirmedLocal->count(), 'color' => '#10b981'],
                    ['label' => 'En attente', 'value' => $pending->count(), 'color' => '#f59e0b'],
                    ['label' => 'Rejetées', 'value' => $rejected->count(), 'color' => '#ef4444'],
                ],
                'trend' => collect(range(5, 0))->map(function ($weeksAgo) use ($requests) {
                    $start = now()->subWeeks($weeksAgo)->startOfWeek();
                    $end = $start->copy()->endOfWeek();
                    $week = $requests->filter(fn ($d) => $d->created_at->between($start, $end));
                    return ['week' => 'S' . $start->weekOfYear, 'recues' => $week->count(), 'traitees' => $week->whereIn('status', ['pending_local_admin', 'confirmed_local_admin', 'rejected'])->count()];
                })->values(),
                'approvedRequests' => $confirmedLocal->take(5)->map(fn ($d) => [
                    'id' => $d->id, 'requester' => $d->user?->name ?? '—',
                    'agency' => $d->agency?->name ?? '—', 'amount' => $this->amount($d),
                    'approved' => $d->confirmed_at?->locale('fr')->isoFormat('DD MMM YYYY') ?? '—',
                    'status' => 'Acceptée',
                ])->values(),
                'notifications' => [
                    ['id' => 1, 'title' => 'Demandes à vérifier', 'text' => $pending->count() . ' dossier(s) attendent votre décision.', 'tone' => 'warning'],
                    ['id' => 2, 'title' => 'Validations finales', 'text' => $confirmedLocal->count() . ' demande(s) acceptée(s) par les Administrateurs Locaux.', 'tone' => 'success'],
                ],
            ],
        ]);
    }

    public function operations(string $section, Request $request)
    {
        abort_unless(in_array($section, ['demandes', 'stock', 'validations'], true), 404);

        $result = $section === 'stock' ? $this->stockItems($request) : $this->requestItems($section, $request);

        return Inertia::render('Administrative/Workspace', [
            'section' => $section,
            'user' => $this->userPayload($request),
            'initialItems' => $result['items'],
            'initialPagination' => ['currentPage' => $result['currentPage'], 'totalPages' => $result['totalPages']],
        ]);
    }

    public function approved(Request $request)
    {
        $search = $request->input('search', '');
        $query = Demande::with(['user', 'agency', 'validatedBy', 'confirmedBy'])
            ->createdByRole('Responsable Commercial')
            ->where('status', 'confirmed_local_admin');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('agency', fn ($aq) => $aq->where('name', 'like', "%{$search}%"));
            });
        }

        $paginator = $query->latest('confirmed_at')->paginate(15);
        $items = $paginator->getCollection()->map(fn ($d) => [
            'id' => $d->id, 'title' => $d->title, 'requester' => $d->user?->name ?? '—',
            'requesterEmail' => $d->user?->email, 'agency' => $d->agency?->name ?? '—',
            'type' => 'Achat', 'priority' => $this->priority($d->priority),
            'budget' => $this->rawAmount($d), 'status' => 'Acceptée',
            'description' => $d->description,
            'validatedAt' => $d->validated_at?->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
            'confirmedAt' => $d->confirmed_at?->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
            'validator' => $d->confirmedBy?->name ?? '—',
        ]);

        return Inertia::render('Administrative/SupplierOrders', [
            'user' => $this->userPayload($request),
            'approvedRequests' => $items,
            'initialPagination' => ['currentPage' => $paginator->currentPage(), 'totalPages' => $paginator->lastPage()],
        ]);
    }

    public function decide(int $id, Request $request)
    {
        $data = $request->validate([
            'decision' => ['required', 'in:approved,rejected'],
            'reason' => ['nullable', 'required_if:decision,rejected', 'string', 'min:5'],
        ]);
        $demande = Demande::with(['user', 'agency'])->createdByRole('Responsable Commercial')->where('status', 'submitted')->findOrFail($id);
        $actor = $request->user();

        $newStatus = match (true) {
            $data['decision'] === 'rejected' => 'rejected',
            $demande->confirmed_by !== null => 'confirmed_local_admin',
            default => 'pending_local_admin',
        };

        DB::transaction(function () use ($demande, $data, $actor, $newStatus, $request) {
            $demande->update([
                'status' => $newStatus,
                'validated_by' => $data['decision'] === 'approved' ? $actor?->id : null,
                'validated_at' => $data['decision'] === 'approved' ? now() : null,
                'refused_by' => $data['decision'] === 'rejected' ? $actor?->id : null,
                'refused_at' => $data['decision'] === 'rejected' ? now() : null,
                'refusal_reason' => $data['decision'] === 'rejected' ? $data['reason'] : null,
            ]);

            if ($actor) {
                $this->auditLogs->log(
                    user: $actor, action: $data['decision'] === 'approved' ? 'Validation' : 'Rejet',
                    module: 'Demandes', description: "Traitement administratif de la demande « {$demande->title} »",
                    target: $demande->title,                     oldValues: ['statut' => 'submitted'],
                    newValues: ['statut' => $newStatus], ipAddress: $request->ip(), userAgent: $request->userAgent(),
                );
            }
        });

        if ($demande->user) {
            $message = match ($newStatus) {
                'confirmed_local_admin' => 'Votre demande « ' . $demande->title . ' » a été confirmée par la Gestion Administrative et l\'Administrateur Local.',
                'pending_local_admin' => 'Votre demande « ' . $demande->title . ' » a été validée administrativement.',
                'rejected' => 'Votre demande « ' . $demande->title . ' » a été rejetée. Motif : ' . $data['reason'],
                default => 'Votre demande « ' . $demande->title . ' » a été traitée.',
            };

            $this->notifications->create(
                user: $demande->user,
                title: $data['decision'] === 'approved' ? 'Demande validée' : 'Demande rejetée',
                description: $message,
                type: $data['decision'] === 'approved' ? 'success' : 'warning',
                source: 'demandes', actionUrl: "/dashboard-commercial/demandes/{$demande->id}",
            );
        }

        $localAdminRole = \App\Models\Role::where('name', 'Administrateur Local')->value('id');
        $localAdminUsers = User::where('role_id', $localAdminRole)
            ->where('status', 'active')
            ->where('agency_id', $demande->agency_id)
            ->get();

        if ($localAdminUsers->isEmpty()) {
            $localAdminUsers = User::where('role_id', $localAdminRole)
                ->where('status', 'active')
                ->get();
        }

        if ($data['decision'] === 'approved') {
            $localAdminUsers->each(function (User $user) use ($demande) {
                $this->notifications->create(
                    user: $user,
                    title: 'Demande à confirmer',
                    description: "La demande « {$demande->title} » a été validée administrativement et attend votre confirmation.",
                    type: 'info', source: 'demandes',
                    actionUrl: "/dashboard-admin-local/demandes/{$demande->id}",
                );
            });

            try {
                foreach ($localAdminUsers as $recipient) {
                    Mail::to($recipient->email)->send(new NouvelleDemandeALMail($demande, $actor));
                }
            } catch (\Throwable $e) {
                Log::error("Erreur envoi email AL demande {$demande->id}: {$e->getMessage()}");
            }
        } else {
            $localAdminUsers->each(function (User $user) use ($demande, $data) {
                $this->notifications->create(
                    user: $user,
                    title: 'Demande rejetée',
                    description: "La demande « {$demande->title} » a été rejetée par la Gestion Administrative. Motif : {$data['reason']}",
                    type: 'warning', source: 'demandes',
                    actionUrl: "/dashboard-admin-local/demandes/{$demande->id}",
                );
            });
        }

        return back()->with('success', $data['decision'] === 'approved'
            ? 'Demande transmise à l\'Administrateur Local.' : 'Demande rejetée.');
    }

    private function requestItems(string $section, Request $request): array
    {
        $search = $request->input('search', '');
        $agency = $request->input('agency', 'Toutes');
        $statuses = $section === 'demandes'
            ? ['submitted']
            : ['pending_local_admin', 'confirmed_local_admin', 'rejected_local_admin'];

        $query = Demande::with(['user', 'agency', 'validatedBy', 'confirmedBy'])
            ->createdByRole('Responsable Commercial')
            ->whereIn('status', $statuses);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"))
                  ->orWhere('product_name', 'like', "%{$search}%");
            });
        }
        if ($agency !== 'Toutes') {
            $query->whereHas('agency', fn ($q) => $q->where('name', $agency));
        }

        $paginator = $query->latest()->paginate(15);
        $items = $paginator->getCollection()->map(fn ($d) => [
            'id' => $d->id, 'nom' => $d->title, 'demandeur' => $d->user?->name ?? '—',
            'agence' => $d->agency?->name ?? '—', 'montant' => $this->amount($d),
            'date' => $d->created_at->locale('fr')->isoFormat('DD/MM/YYYY HH:mm'),
            'auteur' => $d->validatedBy?->name ?? $d->confirmedBy?->name,
            'historique' => $this->statusLabel($d->status, $section),
            'statut' => $this->statusLabel($d->status, $section),
            'produits' => $d->product_name ?: collect($d->products)->pluck('name')->join(', '),
            'completude' => filled($d->title) && filled($d->agency_id) && (filled($d->product_name) || filled($d->products)) ? 100 : 75,
            'priorite' => $this->priority($d->priority), 'motif' => $d->refusal_reason,
        ]);

        return [
            'items' => $items,
            'currentPage' => $paginator->currentPage(),
            'totalPages' => $paginator->lastPage(),
        ];
    }

    private function stockItems(Request $request): array
    {
        $search = $request->input('search', '');
        $agency = $request->input('agency', 'Toutes');

        $query = Product::query()->with('agency')->withCategoryThreshold();
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'like', "%{$search}%")
                  ->orWhere('products.category', 'like', "%{$search}%")
                  ->orWhere('products.reference', 'like', "%{$search}%")
                  ->orWhereHas('agency', fn ($aq) => $aq->where('name', 'like', "%{$search}%"));
            });
        }
        if ($agency !== 'Toutes') {
            $query->whereHas('agency', fn ($q) => $q->where('name', $agency));
        }

        $paginator = $query->latest('products.created_at')->paginate(15);
        $items = $paginator->getCollection()->map(fn ($p) => [
            'id' => $p->reference, 'nom' => $p->name, 'categorie' => $p->category,
            'agence' => $p->agency?->name ?? '—', 'disponible' => max(0, $p->quantity_in_stock - $p->reserved_quantity),
            'reserve' => $p->reserved_quantity, 'seuil' => $p->effectiveMinimumStock(), 'emplacement' => 'Stock principal',
            'statut' => $p->quantity_in_stock === 0 ? 'Rupture' : ($p->isLowStock() ? 'Critique' : ($p->isOverstock() ? 'Surabondant' : 'Disponible')),
        ]);

        return [
            'items' => $items,
            'currentPage' => $paginator->currentPage(),
            'totalPages' => $paginator->lastPage(),
        ];
    }

    private function dashboardRequest(Demande $d): array
    {
        return [
            'id' => $d->id, 'requester' => $d->user?->name ?? '—', 'client' => $d->title,
            'agency' => $d->agency?->name ?? '—', 'amount' => $this->amount($d),
            'completeness' => filled($d->product_name) || filled($d->products) ? 100 : 75,
            'status' => 'À vérifier', 'products' => $d->product_name ?: collect($d->products)->pluck('name')->join(', '),
        ];
    }

    private function rawAmount(Demande $d): string
    {
        return number_format(collect($d->products)->sum(fn ($p) => (float) ($p['price'] ?? 0) * (int) ($p['quantity'] ?? 1)), 0, ',', ' ');
    }

    private function amount(Demande $d): string
    {
        return $this->rawAmount($d) . ' MAD';
    }

    private function statusLabel(string $status, string $section = 'demandes'): string
    {
        if ($section === 'validations') {
            return match ($status) {
                'pending_local_admin' => 'En attente Administrateur Local',
                'confirmed_local_admin' => 'Confirmée par Administrateur Local',
                'rejected_local_admin' => 'Rejetée par Administrateur Local',
                default => ucfirst($status),
            };
        }

        return match ($status) {
            'submitted' => 'À vérifier', 'pending_local_admin' => 'En attente',
            'confirmed_local_admin' => 'Validation finale', 'rejected' => 'Rejetée',
            'rejected_local_admin' => 'Rejetée', default => ucfirst($status),
        };
    }

    private function priority(string $priority): string
    {
        return match ($priority) {'urgent' => 'Urgente', 'high' => 'Haute', 'low' => 'Basse', default => 'Moyenne'};
    }

    private function userPayload(Request $request): array
    {
        $user = $request->user();
        if (!$user) return ['name' => 'Fatima Zahra El Mansouri', 'email' => 'f.elmansouri@supdata.ma', 'role' => 'Gestion Administrative'];
        $user->loadMissing(['role', 'agency']);
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role?->name, 'agency' => $user->agency?->name];
    }
}
