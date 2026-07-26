<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Models\Demande;
use App\Models\Product;
use App\Models\User;
use App\Services\AuditLogService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdministrativeDashboardController extends Controller
{
    public function __construct(
        private AuditLogService $auditLogs,
        private NotificationService $notifications,
    ) {}

    public function index(Request $request)
    {
        $requests = Demande::with(['user', 'agency'])->latest()->get();
        $pending = $requests->where('status', 'pending');
        $approved = $requests->where('status', 'approved');
        $confirmed = $requests->where('status', 'confirmed');
        $rejected = $requests->where('status', 'rejected');

        return Inertia::render('Dashboard/Administrative/Index', [
            'user' => $this->userPayload($request),
            'dashboardData' => [
                'stats' => [
                    ['id' => 'review', 'label' => 'À vérifier', 'value' => $pending->count(), 'detail' => $pending->where('priority', 'urgent')->count() . ' urgentes'],
                    ['id' => 'approval', 'label' => 'Chez Admin local', 'value' => $approved->count(), 'detail' => 'en validation finale'],
                    ['id' => 'approved', 'label' => 'Demandes acceptées', 'value' => $confirmed->count(), 'detail' => 'validations finales reçues'],
                    ['id' => 'processed', 'label' => 'Traitées', 'value' => $approved->count() + $confirmed->count() + $rejected->count(), 'detail' => 'demandes traitées'],
                    ['id' => 'rejected', 'label' => 'Rejetées', 'value' => $rejected->count(), 'detail' => 'avec motif enregistré'],
                    ['id' => 'delay', 'label' => 'Délai moyen', 'value' => '—', 'detail' => 'calculé sur les dossiers'],
                ],
                'requests' => $pending->take(12)->map(fn ($d) => $this->dashboardRequest($d))->values(),
                'flow' => [
                    ['label' => 'Reçues', 'value' => $requests->count(), 'color' => '#2563eb'],
                    ['label' => 'Validées', 'value' => $approved->count() + $confirmed->count(), 'color' => '#10b981'],
                    ['label' => 'En attente', 'value' => $pending->count(), 'color' => '#f59e0b'],
                    ['label' => 'Rejetées', 'value' => $rejected->count(), 'color' => '#ef4444'],
                ],
                'trend' => collect(range(5, 0))->map(function ($weeksAgo) use ($requests) {
                    $start = now()->subWeeks($weeksAgo)->startOfWeek();
                    $end = $start->copy()->endOfWeek();
                    $week = $requests->filter(fn ($d) => $d->created_at->between($start, $end));
                    return ['week' => 'S' . $start->weekOfYear, 'recues' => $week->count(), 'traitees' => $week->whereIn('status', ['approved', 'confirmed', 'rejected'])->count()];
                })->values(),
                'approvedRequests' => $confirmed->take(5)->map(fn ($d) => [
                    'id' => $d->id, 'requester' => $d->user?->name ?? '—',
                    'agency' => $d->agency?->name ?? '—', 'amount' => $this->amount($d),
                    'approved' => $d->confirmed_at?->locale('fr')->isoFormat('DD MMM YYYY') ?? '—',
                    'status' => 'Acceptée',
                ])->values(),
                'notifications' => [
                    ['id' => 1, 'title' => 'Demandes à vérifier', 'text' => $pending->count() . ' dossier(s) attendent votre décision.', 'tone' => 'warning'],
                    ['id' => 2, 'title' => 'Validations finales', 'text' => $confirmed->count() . ' demande(s) acceptée(s) par les Administrateurs Locaux.', 'tone' => 'success'],
                ],
            ],
        ]);
    }

    public function operations(string $section, Request $request)
    {
        abort_unless(in_array($section, ['demandes', 'stock', 'validations'], true), 404);
        $items = $section === 'stock' ? $this->stockItems() : $this->requestItems($section);

        return Inertia::render('Administrative/Workspace', [
            'section' => $section, 'user' => $this->userPayload($request), 'initialItems' => $items,
        ]);
    }

    public function approved(Request $request)
    {
        $items = Demande::with(['user', 'agency', 'confirmedBy'])
            ->where('status', 'confirmed')->latest('confirmed_at')->get()
            ->map(fn ($d) => [
                'id' => $d->id, 'title' => $d->title, 'requester' => $d->user?->name ?? '—',
                'requesterEmail' => $d->user?->email, 'agency' => $d->agency?->name ?? '—',
                'type' => 'Achat', 'priority' => $this->priority($d->priority),
                'budget' => $this->rawAmount($d), 'status' => 'validated',
                'description' => $d->description, 'validatedAt' => $d->confirmed_at?->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'validator' => $d->confirmedBy?->name ?? 'Administrateur Local',
            ]);

        return Inertia::render('Administrative/SupplierOrders', [
            'user' => $this->userPayload($request), 'approvedRequests' => $items,
        ]);
    }

    public function decide(int $id, Request $request)
    {
        $data = $request->validate([
            'decision' => ['required', 'in:approved,rejected'],
            'reason' => ['nullable', 'required_if:decision,rejected', 'string', 'min:5'],
        ]);
        $demande = Demande::with('user')->where('status', 'pending')->findOrFail($id);
        $actor = $request->user();

        DB::transaction(function () use ($demande, $data, $actor, $request) {
            $demande->update([
                'status' => $data['decision'],
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
                    target: $demande->title, oldValues: ['statut' => 'pending'],
                    newValues: ['statut' => $data['decision']], ipAddress: $request->ip(), userAgent: $request->userAgent(),
                );
            }
        });

        if ($demande->user) {
            $this->notifications->create(
                user: $demande->user,
                title: $data['decision'] === 'approved' ? 'Demande transmise' : 'Demande rejetée',
                description: $data['decision'] === 'approved'
                    ? "Votre demande « {$demande->title} » a été validée administrativement et transmise à l’Administrateur Local."
                    : "Votre demande « {$demande->title} » a été rejetée. Motif : {$data['reason']}",
                type: $data['decision'] === 'approved' ? 'success' : 'warning',
                source: 'demandes', actionUrl: "/dashboard-commercial/demandes/{$demande->id}",
            );
        }

        if ($data['decision'] === 'approved') {
            $localAdminRole = \App\Models\Role::where('name', 'Administrateur Local')->value('id');
            User::where('role_id', $localAdminRole)
                ->where('agency_id', $demande->agency_id)
                ->where('status', 'active')
                ->each(fn (User $user) => $this->notifications->create(
                    user: $user,
                    title: 'Demande à confirmer',
                    description: "La demande « {$demande->title} » a été validée administrativement et attend votre confirmation.",
                    type: 'info', source: 'demandes',
                    actionUrl: "/dashboard-admin-local/demandes/{$demande->id}",
                ));
        }

        return back()->with('success', $data['decision'] === 'approved' ? 'Demande transmise à l’Administrateur Local.' : 'Demande rejetée.');
    }

    private function requestItems(string $section)
    {
        $statuses = $section === 'demandes' ? ['pending'] : ['approved', 'confirmed', 'rejected'];
        return Demande::with(['user', 'agency', 'validatedBy', 'confirmedBy'])
            ->whereIn('status', $statuses)->latest()->get()->map(fn ($d) => [
                'id' => $d->id, 'nom' => $d->title, 'demandeur' => $d->user?->name ?? '—',
                'agence' => $d->agency?->name ?? '—', 'montant' => $this->amount($d),
                'date' => $d->created_at->locale('fr')->isoFormat('DD/MM/YYYY HH:mm'),
                'auteur' => $d->validatedBy?->name ?? $d->confirmedBy?->name,
                'historique' => $this->statusLabel($d->status), 'statut' => $this->statusLabel($d->status),
                'produits' => $d->product_name ?: collect($d->products)->pluck('name')->join(', '),
                'completude' => filled($d->title) && filled($d->agency_id) && (filled($d->product_name) || filled($d->products)) ? 100 : 75,
                'priorite' => $this->priority($d->priority), 'motif' => $d->refusal_reason,
            ]);
    }

    private function stockItems()
    {
        return Product::with('agency')->latest()->get()->map(fn ($p) => [
            'id' => $p->reference, 'nom' => $p->name, 'categorie' => $p->category,
            'agence' => $p->agency?->name ?? '—', 'disponible' => max(0, $p->quantity_in_stock - $p->reserved_quantity),
            'reserve' => $p->reserved_quantity, 'seuil' => $p->minimum_stock, 'emplacement' => 'Stock principal',
            'statut' => $p->quantity_in_stock === 0 ? 'Rupture' : ($p->isLowStock() ? 'Critique' : 'Disponible'),
        ]);
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

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'pending' => 'À vérifier', 'approved' => 'En attente',
            'confirmed' => 'Validation finale', 'rejected' => 'Rejetée', default => ucfirst($status),
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
