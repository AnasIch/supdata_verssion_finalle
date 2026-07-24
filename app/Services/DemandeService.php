<?php

namespace App\Services;

use App\Models\Demande;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Mail\NouvelleDemandeMail;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DemandeService
{
    public function __construct(
        private NotificationService $notificationService,
        private AuditLogService $auditLogService,
    ) {}

    public function create(array $data, Request $request): Demande
    {
        $user = $request->user();

        $demande = DB::transaction(function () use ($data, $request, $user) {
            $products = $data['products'] ?? [];
            $totalQuantity = array_sum(array_column($products, 'quantity'));
            $firstProductName = $products[0]['product']['name'] ?? null;

            $demande = Demande::create([
                'title' => $data['title'] ?? 'Demande d\'achat',
                'description' => $data['comment'] ?? null,
                'user_id' => $user->id,
                'agency_id' => $user->agency_id,
                'status' => 'pending',
                'priority' => $data['priority'] ?? 'medium',
                'quantity' => $totalQuantity,
                'product_name' => $firstProductName,
                'products' => $products,
            ]);

            $this->auditLogService->log(
                user: $user,
                action: 'Création',
                module: 'Demandes',
                description: "Création de la demande d'achat {$demande->title}",
                target: $demande->title,
                newValues: [
                    'titre' => $demande->title,
                    'priorite' => $demande->priority,
                    'produits' => count($products),
                ],
                ipAddress: $request->ip(),
                userAgent: $request->userAgent(),
            );

            return $demande;
        });

        $this->notifyGestionAdministrative($demande, $user);
        $this->notifyCreator($demande, $user, [
            'title' => 'Demande d\'achat créée',
            'description' => "Votre demande d'achat « {$demande->title} » a été créée avec succès et envoyée à la Gestion Administrative pour traitement.",
            'type' => 'success',
            'source' => 'demandes',
            'actionUrl' => "/demandes/{$demande->id}",
            'context' => [
                'reference' => $demande->title,
                'status' => 'En attente',
                'priority' => $demande->priority,
                'quantity' => $demande->quantity,
            ],
        ]);

        try {
            $this->sendEmailToGestionAdministrative($demande, $user);
        } catch (\Throwable $e) {
            Log::error("Erreur envoi email demande {$demande->id}: {$e->getMessage()}");
        }

        return $demande;
    }

    public function index(Request $request): LengthAwarePaginator
    {
        $user = $request->user();

        $query = Demande::where('user_id', $user->id)
            ->with('agency');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate(10);
    }

    public function show(int $id, Request $request): ?Demande
    {
        $user = $request->user();

        return Demande::where('id', $id)
            ->where('user_id', $user->id)
            ->with('agency', 'user')
            ->first();
    }

    public function archive(int $id, Request $request): bool
    {
        $user = $request->user();

        $demande = Demande::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$demande) {
            return false;
        }

        $demande->delete();

        $this->auditLogService->log(
            user: $user,
            action: 'Archivage',
            module: 'Demandes',
            description: "Archivage de la demande d'achat {$demande->title}",
            target: $demande->title,
            oldValues: [
                'titre' => $demande->title,
                'statut' => $demande->status,
            ],
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        $this->notifyCreator($demande, $user, [
            'title' => 'Demande archivée',
            'description' => "Votre demande d'achat « {$demande->title} » a été archivée avec succès.",
            'type' => 'warning',
            'source' => 'demandes',
            'actionUrl' => "/demandes/{$demande->id}",
        ]);

        return true;
    }

    public function getStats(Request $request): array
    {
        $user = $request->user();
        $query = Demande::where('user_id', $user->id);

        $total = (clone $query)->count();
        $pending = (clone $query)->where('status', 'pending')->count();
        $approved = (clone $query)->where('status', 'approved')->count();
        $rejected = (clone $query)->where('status', 'rejected')->count();

        return [
            'total' => $total,
            'pending' => $pending,
            'accepted' => $approved,
            'refused' => $rejected,
        ];
    }

    private function notifyCreator(Demande $demande, User $creator, array $data): void
    {
        try {
            $this->notificationService->create(
                user: $creator,
                title: $data['title'],
                description: $data['description'],
                type: $data['type'] ?? 'info',
                source: $data['source'] ?? 'demandes',
                actionUrl: $data['actionUrl'] ?? null,
                context: $data['context'] ?? [],
            );
        } catch (\Throwable $e) {
            Log::error("Erreur notification créateur demande {$demande->id}: {$e->getMessage()}");
        }
    }

    private function notifyGestionAdministrative(Demande $demande, User $creator): void
    {
        try {
            $gaRole = Role::where('name', 'Gestion Administrative')->first();

            if (!$gaRole) return;

            $gaUsers = User::where('role_id', $gaRole->id)
                ->where('status', 'active')
                ->get();

            foreach ($gaUsers as $gaUser) {
                $this->notificationService->create(
                    user: $gaUser,
                    title: 'Nouvelle demande d\'achat',
                    description: "{$creator->name} a soumis une nouvelle demande d'achat : {$demande->title}",
                    type: 'info',
                    source: 'demandes',
                    actionUrl: "/demandes/{$demande->id}",
                );
            }
        } catch (\Throwable $e) {
            Log::error("Erreur notification demande {$demande->id}: {$e->getMessage()}");
        }
    }

    private function sendEmailToGestionAdministrative(Demande $demande, User $creator): void
    {
        $gaRole = Role::where('name', 'Gestion Administrative')->first();

        if (!$gaRole) return;

        $gaUsers = User::where('role_id', $gaRole->id)
            ->where('status', 'active')
            ->get();

        foreach ($gaUsers as $gaUser) {
            Mail::to($gaUser->email)->send(
                new NouvelleDemandeMail($demande, $creator)
            );
        }
    }
}
