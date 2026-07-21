<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationService
{
    public function __construct(
        private NotificationService $notificationService,
        private AuditLogService $auditLogService,
    ) {}

    public function create(array $data, Request $request): Reservation
    {
        $user = $request->user();
        $product = Product::findOrFail($data['product_id']);

        $available = $product->quantity_in_stock - $product->reserved_quantity;
        if ($available < $data['quantity']) {
            throw new \Exception('Stock insuffisant pour effectuer cette réservation.');
        }

        $reservation = DB::transaction(function () use ($data, $user, $product, $request) {
            $reference = 'RES-' . date('Y') . '-' . str_pad(
                Reservation::max('id') + 1,
                4,
                '0',
                STR_PAD_LEFT
            );

            $reservation = Reservation::create([
                'reference' => $reference,
                'user_id' => $user->id,
                'product_id' => $product->id,
                'agency_id' => $product->agency_id,
                'client_name' => $data['client_name'],
                'quantity' => $data['quantity'],
                'status' => 'reserved',
                'remark' => $data['remark'] ?? null,
            ]);

            $product->increment('reserved_quantity', $data['quantity']);

            $this->auditLogService->log(
                user: $user,
                action: 'Création',
                module: 'Réservations',
                description: "Création de la réservation {$reference} pour {$data['client_name']}",
                target: $reference,
                newValues: [
                    'reference' => $reference,
                    'client' => $data['client_name'],
                    'produit' => $product->name,
                    'quantite' => $data['quantity'],
                ],
                ipAddress: $request->ip(),
                userAgent: $request->userAgent(),
            );

            return $reservation;
        });

        $this->notifyResponsableStock($reservation, $user, $product);
        $this->notifyCreator($user, [
            'title' => 'Réservation créée',
            'description' => "Votre réservation « {$reservation->reference} » pour le client « {$reservation->client_name} » a été créée avec succès. Le Responsable de Stock a été notifié.",
            'type' => 'success',
            'source' => 'reservations',
            'actionUrl' => "/reservations/{$reservation->id}",
            'context' => [
                'reference' => $reservation->reference,
                'client_name' => $reservation->client_name,
                'product_name' => $product->name,
                'product_reference' => $product->reference,
                'quantity' => $reservation->quantity,
                'agency_name' => $product->agency->name ?? '—',
            ],
        ]);

        return $reservation;
    }

    public function index(Request $request): LengthAwarePaginator
    {
        $user = $request->user();

        $query = Reservation::where('user_id', $user->id)
            ->with('product', 'agency');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhereHas('product', function ($pq) use ($search) {
                      $pq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $query->orderBy('created_at', 'desc');

        return $query->paginate(10);
    }

    public function show(int $id, Request $request): ?Reservation
    {
        $user = $request->user();

        return Reservation::where('id', $id)
            ->where('user_id', $user->id)
            ->with('product', 'agency', 'user')
            ->first();
    }

    public function update(int $id, array $data, Request $request): bool
    {
        $user = $request->user();

        $reservation = Reservation::where('id', $id)
            ->where('user_id', $user->id)
            ->where('status', 'reserved')
            ->first();

        if (!$reservation) {
            return false;
        }

        $quantityDelta = $data['quantity'] - $reservation->quantity;

        if ($quantityDelta > 0) {
            $product = Product::find($reservation->product_id);
            $available = $product->quantity_in_stock - $product->reserved_quantity;
            if ($available < $quantityDelta) {
                throw new \Exception('Stock insuffisant pour cette modification.');
            }
        }

        DB::transaction(function () use ($reservation, $data, $quantityDelta) {
            $reservation->update([
                'client_name' => $data['client_name'],
                'quantity' => $data['quantity'],
                'remark' => $data['remark'] ?? null,
            ]);

            if ($quantityDelta !== 0) {
                $product = Product::find($reservation->product_id);
                if ($product) {
                    $product->increment('reserved_quantity', $quantityDelta);
                }
            }
        });

        $this->auditLogService->log(
            user: $user,
            action: 'Modification',
            module: 'Réservations',
            description: "Modification de la réservation {$reservation->reference}",
            target: $reservation->reference,
            newValues: [
                'client' => $data['client_name'],
                'quantite' => $data['quantity'],
            ],
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        $product = Product::find($reservation->product_id);
        $this->notifyCreator($user, [
            'title' => 'Réservation modifiée',
            'description' => "La réservation « {$reservation->reference} » a été modifiée. Nouveau client : « {$data['client_name']} », quantité : {$data['quantity']}.",
            'type' => 'info',
            'source' => 'reservations',
        ]);

        return true;
    }

    public function delete(int $id, Request $request): bool
    {
        $user = $request->user();

        $reservation = Reservation::where('id', $id)
            ->where('user_id', $user->id)
            ->where('status', 'reserved')
            ->with('product')
            ->first();

        if (!$reservation) {
            return false;
        }

        $ref = $reservation->reference;
        $clientName = $reservation->client_name;
        $productName = $reservation->product->name ?? '—';
        $quantity = $reservation->quantity;

        DB::transaction(function () use ($reservation, $user, $request) {
            $product = Product::find($reservation->product_id);
            if ($product) {
                $product->decrement('reserved_quantity', $reservation->quantity);
            }

            $this->auditLogService->log(
                user: $user,
                action: 'Suppression',
                module: 'Réservations',
                description: "Suppression de la réservation {$reservation->reference}",
                target: $reservation->reference,
                ipAddress: $request->ip(),
                userAgent: $request->userAgent(),
            );

            $reservation->delete();
        });

        $this->notifyCreator($user, [
            'title' => 'Réservation supprimée',
            'description' => "La réservation « {$ref} » pour le client « {$clientName} » ({$quantity}x {$productName}) a été supprimée. Le stock réservé a été libéré.",
            'type' => 'warning',
            'source' => 'reservations',
        ]);

        return true;
    }

    public function getStats(Request $request): array
    {
        $user = $request->user();
        $query = Reservation::where('user_id', $user->id);

        $total = (clone $query)->count();
        $reserved = (clone $query)->where('status', 'reserved')->count();
        $delivered = (clone $query)->where('status', 'delivered')->count();
        $cancelled = (clone $query)->where('status', 'cancelled')->count();

        return [
            'total' => $total,
            'reserved' => $reserved,
            'delivered' => $delivered,
            'cancelled' => $cancelled,
        ];
    }

    public function getProducts(Request $request): array
    {
        $user = $request->user();

        return Product::where('agency_id', $user->agency_id)
            ->where('quantity_in_stock', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'reference' => $p->reference,
                'category' => $p->category,
                'available' => $p->quantity_in_stock - $p->reserved_quantity,
            ])
            ->toArray();
    }

    private function notifyResponsableStock(Reservation $reservation, User $creator, Product $product): void
    {
        try {
            $rsRole = Role::where('name', 'Responsable Stock')->first();

            if (!$rsRole) return;

            $rsUsers = User::where('role_id', $rsRole->id)
                ->where('status', 'active')
                ->get();

            $availableAfter = $product->quantity_in_stock - $product->reserved_quantity;

            foreach ($rsUsers as $rsUser) {
                $this->notificationService->create(
                    user: $rsUser,
                    title: 'Nouvelle réservation de stock',
                    description: "{$creator->name} a réservé {$reservation->quantity} unité(s) du produit « {$product->name} » pour le client « {$reservation->client_name} ».",
                    type: 'info',
                    source: 'reservations',
                    actionUrl: "/reservations/{$reservation->id}",
                    context: [
                        'reference' => $reservation->reference,
                        'client_name' => $reservation->client_name,
                        'product_name' => $product->name,
                        'product_reference' => $product->reference,
                        'category' => $product->category,
                        'quantity' => $reservation->quantity,
                        'agency_name' => $product->agency->name ?? '—',
                        'creator_name' => $creator->name,
                        'available_after' => $availableAfter,
                        'remark' => $reservation->remark,
                    ],
                );
            }
        } catch (\Throwable $e) {
            Log::error("Erreur notification réservation {$reservation->id}: {$e->getMessage()}");
        }
    }

    private function notifyCreator(User $creator, array $data): void
    {
        try {
            $this->notificationService->create(
                user: $creator,
                title: $data['title'],
                description: $data['description'],
                type: $data['type'] ?? 'info',
                source: $data['source'] ?? 'reservations',
                actionUrl: $data['actionUrl'] ?? null,
                context: $data['context'] ?? [],
            );
        } catch (\Throwable $e) {
            Log::error("Erreur notification créateur: {$e->getMessage()}");
        }
    }
}
