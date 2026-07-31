<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryRequest;
use App\Models\Inventory;
use App\Models\InventoryItem;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InventoryController extends Controller
{
    public function __construct(private InventoryService $service) {}

    public function index(Request $request)
    {
        $result = $this->service->index($request);

        return Inertia::render('Stock/Inventaires/Index', [
            'user' => $this->userPayload($request),
            'inventories' => $result['inventories'],
            'pagination' => $result['pagination'],
            'stats' => $this->service->getStats(),
            'agencies' => $this->service->getAgencies(),
            'products' => $this->service->getProducts(),
            'responsables' => $this->service->getResponsables($request->user()),
            'filters' => [
                'search' => $request->input('search', ''),
                'agency' => $request->input('agency', 'all'),
                'status' => $request->input('status', 'all'),
                'date' => $request->input('date', ''),
            ],
        ]);
    }

    public function store(InventoryRequest $request)
    {
        $inventory = $this->service->create($request->validated(), $request);

        return redirect()->route('rs.inventaires.show', $inventory)
            ->with('success', "Inventaire {$inventory->reference} créé. Commencez la saisie des produits.");
    }

    public function show(int $id, Request $request)
    {
        $inventory = $this->service->show($id);

        return Inertia::render('Stock/Inventaires/Show', [
            'user' => $this->userPayload($request),
            'inventory' => $this->serializeInventory($inventory),
            'items' => $inventory->items->map(fn ($item) => $this->serializeItem($item))->values(),
            'products' => $this->service->getProducts($inventory->agency_id),
            'agencies' => $this->service->getAgencies(),
        ]);
    }

    public function update(InventoryRequest $request, int $id)
    {
        try {
            $this->service->update($id, $request->validated(), $request);
        } catch (\Exception $e) {
            return back()->withErrors(['inventory' => $e->getMessage()]);
        }

        return back()->with('success', 'Inventaire enregistré.');
    }

    public function terminate(InventoryRequest $request, int $id)
    {
        try {
            $inventory = $this->service->terminate($id, $request->validated(), $request);
        } catch (\Exception $e) {
            return back()->withErrors(['inventory' => $e->getMessage()]);
        }

        $ecarts = $inventory->items()->where('difference', '!=', 0)->count();

        return back()->with(
            'success',
            "Inventaire {$inventory->reference} terminé" . ($ecarts > 0 ? " avec {$ecarts} écart(s) détecté(s)." : '. Aucun écart détecté.')
        );
    }

    public function destroy(int $id, Request $request)
    {
        $this->service->destroy($id, $request);

        return redirect()->route('rs.inventaires.index')->with('success', 'Inventaire supprimé.');
    }

    public function export(int $id, string $format)
    {
        abort_unless(in_array($format, ['csv', 'excel'], true), 404);

        $inventory = $this->service->exportData($id);

        return $format === 'csv' ? $this->csv($inventory) : $this->excel($inventory);
    }

    private function csv(Inventory $inventory): StreamedResponse
    {
        $filename = 'inventaire_' . $inventory->reference . '.csv';

        return response()->streamDownload(function () use ($inventory) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['Référence', 'Date', 'Agence', 'Produit', 'Catégorie', 'Stock système', 'Stock physique', 'Écart', 'Statut', 'Commentaire']);
            foreach ($inventory->items as $item) {
                fputcsv($out, [
                    $inventory->reference,
                    $inventory->date->format('d/m/Y'),
                    $inventory->agency?->name ?? '—',
                    $item->product?->name ?? '—',
                    $item->product?->category ?? '—',
                    $item->system_quantity,
                    $item->physical_quantity,
                    $item->difference,
                    $this->service->statusLabel($item->status),
                    $item->comment ?? '',
                ]);
            }
            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function excel(Inventory $inventory): StreamedResponse
    {
        $filename = 'inventaire_' . $inventory->reference . '.xls';

        return response()->streamDownload(function () use ($inventory) {
            $html = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px">';
            $html .= '<tr style="background:#064e3b;color:#fff"><th colspan="10">Inventaire ' . e($inventory->reference) . ' — ' . e($inventory->agency?->name ?? '—') . ' — ' . $inventory->date->format('d/m/Y') . '</th></tr>';
            $html .= '<tr style="background:#f1f5f9"><th>Référence</th><th>Date</th><th>Agence</th><th>Produit</th><th>Catégorie</th><th>Stock système</th><th>Stock physique</th><th>Écart</th><th>Statut</th><th>Commentaire</th></tr>';
            foreach ($inventory->items as $item) {
                $html .= '<tr>';
                $html .= '<td>' . e($inventory->reference) . '</td>';
                $html .= '<td>' . $inventory->date->format('d/m/Y') . '</td>';
                $html .= '<td>' . e($inventory->agency?->name ?? '—') . '</td>';
                $html .= '<td>' . e($item->product?->name ?? '—') . '</td>';
                $html .= '<td>' . e($item->product?->category ?? '—') . '</td>';
                $html .= '<td>' . $item->system_quantity . '</td>';
                $html .= '<td>' . $item->physical_quantity . '</td>';
                $html .= '<td>' . $item->difference . '</td>';
                $html .= '<td>' . e($this->service->statusLabel($item->status)) . '</td>';
                $html .= '<td>' . e($item->comment ?? '') . '</td>';
                $html .= '</tr>';
            }
            $html .= '</table>';
            echo $html;
        }, $filename, ['Content-Type' => 'application/vnd.ms-excel; charset=UTF-8']);
    }

    private function serializeInventory(Inventory $inventory): array
    {
        return [
            'id' => $inventory->id,
            'reference' => $inventory->reference,
            'date' => $inventory->date->format('d/m/Y'),
            'date_raw' => $inventory->date->toDateString(),
            'type' => $inventory->type,
            'type_label' => $inventory->type === 'general' ? 'Général' : 'Partiel',
            'agency_id' => $inventory->agency_id,
            'agency' => $inventory->agency?->name ?? '—',
            'responsable_id' => $inventory->user_id,
            'responsable' => $inventory->user?->name ?? '—',
            'observation' => $inventory->observation,
            'status' => $inventory->status,
            'status_label' => $inventory->status === 'completed' ? 'Terminé' : 'En cours',
            'completed_at' => $inventory->completed_at?->format('d/m/Y H:i'),
            'completed_by' => $inventory->completedBy?->name ?? '—',
            'produits_controles' => $inventory->items->count(),
            'ecarts' => $inventory->items->where('difference', '!=', 0)->count(),
        ];
    }

    private function serializeItem(InventoryItem $item): array
    {
        return [
            'id' => $item->id,
            'product_id' => $item->product_id,
            'reference' => $item->product?->reference ?? '—',
            'product' => $item->product?->name ?? '—',
            'category' => $item->product?->category ?? '—',
            'agency' => $item->product?->agency?->name ?? '—',
            'system_quantity' => $item->system_quantity,
            'physical_quantity' => $item->physical_quantity,
            'difference' => $item->difference,
            'comment' => $item->comment,
            'status' => $item->status,
        ];
    }

    private function userPayload(Request $request): array
    {
        $user = $request->user();
        if (!$user) {
            return ['name' => 'Rachid Amrani', 'email' => 'r.amrani@supdata.ma', 'role' => 'Responsable Stock'];
        }
        $user->loadMissing(['role', 'agency']);
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role?->name, 'agency' => $user->agency?->name];
    }
}
