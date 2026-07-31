<?php

namespace App\Services;

use App\Models\Agency;
use App\Models\Inventory;
use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function __construct(private AuditLogService $auditLogs) {}

    public function index(Request $request): array
    {
        $query = Inventory::with(['agency', 'user', 'items.product'])->latest('date');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhereHas('agency', fn ($aq) => $aq->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('items.product', fn ($pq) => $pq->where('name', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('agency') && $request->agency !== 'all') {
            $query->whereHas('agency', fn ($aq) => $aq->where('name', $request->agency));
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        $perPage = $request->integer('perPage', 10);
        if (!in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 10;
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return [
            'inventories' => $paginator->getCollection()->map(fn ($inv) => $this->serialize($inv))->values(),
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'totalPages' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'perPage' => $perPage,
            ],
        ];
    }

    public function create(array $data, Request $request): Inventory
    {
        $user = $request->user();

        return DB::transaction(function () use ($data, $request, $user) {
            $inventory = Inventory::create([
                'reference' => $this->nextReference(),
                'agency_id' => $data['agency_id'],
                'user_id' => $data['user_id'] ?? $user?->id,
                'date' => $data['date'] ?? now()->toDateString(),
                'type' => $data['type'] ?? 'general',
                'observation' => $data['observation'] ?? null,
                'status' => 'in_progress',
            ]);

            $this->audit($request, 'Création', $inventory, [
                'agence' => $inventory->agency?->name ?? '—',
                'type' => $inventory->type === 'general' ? 'Général' : 'Partiel',
            ]);

            return $inventory;
        });
    }

    public function show(int $id): Inventory
    {
        return Inventory::with(['agency', 'user', 'completedBy', 'items.product'])->findOrFail($id);
    }

    public function update(int $id, array $data, Request $request): Inventory
    {
        $inventory = Inventory::findOrFail($id);

        if ($inventory->status !== 'in_progress') {
            throw new \Exception('Un inventaire terminé ne peut plus être modifié.');
        }

        return DB::transaction(function () use ($inventory, $data, $request) {
            $inventory->update([
                'date' => $data['date'] ?? $inventory->date,
                'type' => $data['type'] ?? $inventory->type,
                'observation' => $data['observation'] ?? $inventory->observation,
            ]);

            if (isset($data['items'])) {
                $this->syncItems($inventory, $data['items']);
            }

            $this->audit($request, 'Modification', $inventory, [
                'produits contrôlés' => $inventory->items()->count(),
            ]);

            return $inventory->fresh(['agency', 'user', 'completedBy', 'items.product']);
        });
    }

    public function terminate(int $id, array $data, Request $request): Inventory
    {
        $inventory = Inventory::findOrFail($id);

        if ($inventory->status !== 'in_progress') {
            throw new \Exception('Cet inventaire est déjà terminé.');
        }

        return DB::transaction(function () use ($inventory, $data, $request) {
            $inventory->update([
                'observation' => $data['observation'] ?? $inventory->observation,
            ]);

            if (isset($data['items'])) {
                $this->syncItems($inventory, $data['items']);
            }

            $inventory->update([
                'status' => 'completed',
                'completed_at' => now(),
                'completed_by' => $request->user()?->id,
            ]);

            $this->audit($request, 'Terminaison', $inventory, [
                'produits contrôlés' => $inventory->items()->count(),
                'écarts' => $inventory->items()->where('difference', '!=', 0)->count(),
            ]);

            return $inventory->fresh(['agency', 'user', 'completedBy', 'items.product']);
        });
    }

    public function destroy(int $id, Request $request): bool
    {
        return DB::transaction(function () use ($id, $request) {
            $inventory = Inventory::findOrFail($id);
            $this->audit($request, 'Suppression', $inventory);
            return (bool) $inventory->delete();
        });
    }

    public function getStats(): array
    {
        $inProgress = Inventory::where('status', 'in_progress')->count();
        $completed = Inventory::where('status', 'completed')->count();
        $ecarts = InventoryItem::where('difference', '!=', 0)->count();
        $manquants = InventoryItem::where('difference', '<', 0)->count();
        $last = Inventory::where('status', 'completed')->latest('completed_at')->first();

        return [
            ['id' => 'in_progress', 'value' => $inProgress, 'label' => 'En cours', 'detail' => 'inventaires actifs', 'color' => 'bg-blue-50 text-blue-700'],
            ['id' => 'completed', 'value' => $completed, 'label' => 'Terminés', 'detail' => 'inventaires clôturés', 'color' => 'bg-emerald-50 text-emerald-700'],
            ['id' => 'ecarts', 'value' => $ecarts, 'label' => 'Écarts détectés', 'detail' => 'lignes non conformes', 'color' => 'bg-amber-50 text-amber-700'],
            ['id' => 'manquants', 'value' => $manquants, 'label' => 'Produits manquants', 'detail' => 'écarts négatifs', 'color' => 'bg-red-50 text-red-700'],
            ['id' => 'last', 'value' => $last ? $last->completed_at?->format('d/m/Y') : '—', 'label' => 'Dernier inventaire', 'detail' => $last ? $last->reference : 'aucun pour le moment', 'color' => 'bg-violet-50 text-violet-700'],
        ];
    }

    public function getAgencies(): array
    {
        return Agency::orderBy('name')->get(['id', 'name'])
            ->map(fn ($a) => ['id' => $a->id, 'name' => $a->name])
            ->toArray();
    }

    public function getResponsables(?User $current): array
    {
        $users = User::with('role')
            ->whereHas('role', fn ($q) => $q->where('name', 'Responsable Stock'))
            ->orderBy('name')
            ->get();

        if ($users->isEmpty() && $current) {
            $users = collect([$current->load('role')]);
        }

        return $users->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])->values()->toArray();
    }

    public function getProducts(?int $agencyId = null): array
    {
        return Product::with('agency')
            ->when($agencyId !== null, fn ($query) => $query->where('agency_id', $agencyId))
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'reference' => $p->reference,
                'category' => $p->category,
                'system' => $p->quantity_in_stock,
                'agency' => $p->agency?->name ?? '—',
            ])->toArray();
    }

    public function exportData(int $id): Inventory
    {
        return Inventory::with(['agency', 'user', 'completedBy', 'items.product'])->findOrFail($id);
    }

    public function statusLabel(string $status): string
    {
        return match ($status) {
            'conforme' => 'Conforme',
            'petit_ecart' => 'Petit écart',
            'a_verifier' => 'À vérifier',
            default => $status,
        };
    }

    private function syncItems(Inventory $inventory, array $items): void
    {
        $existing = $inventory->items()->pluck('id')->toArray();
        $submitted = [];

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if (!$product || (int) $product->agency_id !== (int) $inventory->agency_id) {
                $label = $product?->name ?? '#' . $item['product_id'];
                throw new \Exception("Le produit « {$label} » n'appartient pas à l'agence de cet inventaire (" . ($inventory->agency?->name ?? 'agence inconnue') . ').');
            }

            $system = (int) ($item['system_quantity'] ?? 0);
            $physical = (int) ($item['physical_quantity'] ?? 0);
            $difference = $physical - $system;
            $status = $difference === 0 ? 'conforme' : (abs($difference) < 5 ? 'petit_ecart' : 'a_verifier');

            $attributes = [
                'product_id' => $item['product_id'],
                'system_quantity' => $system,
                'physical_quantity' => $physical,
                'difference' => $difference,
                'status' => $status,
                'comment' => $item['comment'] ?? null,
            ];

            if (!empty($item['id']) && in_array((int) $item['id'], $existing, true)) {
                InventoryItem::where('id', (int) $item['id'])->where('inventory_id', $inventory->id)->update($attributes);
                $submitted[] = (int) $item['id'];
            } else {
                $submitted[] = $inventory->items()->create($attributes)->id;
            }
        }

        $toDelete = array_values(array_diff($existing, $submitted));
        if ($toDelete) {
            $inventory->items()->whereIn('id', $toDelete)->delete();
        }
    }

    private function nextReference(): string
    {
        return 'INV-' . date('Y') . '-' . str_pad((Inventory::max('id') ?? 0) + 1, 4, '0', STR_PAD_LEFT);
    }

    private function serialize(Inventory $inventory): array
    {
        $ecarts = $inventory->items->where('difference', '!=', 0)->count();

        return [
            'id' => $inventory->id,
            'reference' => $inventory->reference,
            'date' => $inventory->date->format('d/m/Y'),
            'agency' => $inventory->agency?->name ?? '—',
            'responsable' => $inventory->user?->name ?? '—',
            'type' => $inventory->type,
            'type_label' => $inventory->type === 'general' ? 'Général' : 'Partiel',
            'produits_controles' => $inventory->items->count(),
            'ecarts' => $ecarts,
            'status' => $inventory->status,
            'status_label' => $inventory->status === 'completed' ? 'Terminé' : 'En cours',
        ];
    }

    private function audit(Request $request, string $action, Inventory $inventory, array $values = []): void
    {
        $this->auditLogs->log(
            user: $request->user(),
            action: $action,
            module: 'Inventaire',
            description: "$action de l'inventaire {$inventory->reference}",
            target: $inventory->reference,
            newValues: $values ?: null,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );
    }
}
