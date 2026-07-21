<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationFormRequest;
use App\Services\ReservationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function __construct(
        private ReservationService $reservationService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $reservations = $this->reservationService->index($request);
        $stats = $this->reservationService->getStats($request);
        $products = $this->reservationService->getProducts($request);

        return Inertia::render('Commercial/Reservations/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Responsable Commercial',
                'agency' => $user->agency->name ?? '—',
            ],
            'reservations' => $reservations->items(),
            'reservationsMeta' => [
                'currentPage' => $reservations->currentPage(),
                'lastPage' => $reservations->lastPage(),
                'total' => $reservations->total(),
                'perPage' => $reservations->perPage(),
            ],
            'stats' => $stats,
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(StoreReservationFormRequest $request)
    {
        try {
            $this->reservationService->create(
                $request->validated(),
                $request,
            );

            return back()->with('success', 'Réservation créée avec succès. Le Responsable de Stock a été notifié.');
        } catch (\Throwable $e) {
            return back()->withErrors(['stock' => $e->getMessage()]);
        }
    }

    public function update(int $id, Request $request)
    {
        $data = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'remark' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $updated = $this->reservationService->update($id, $data, $request);

            if (!$updated) {
                return back()->withErrors(['reservation' => 'Réservation introuvable ou déjà traitée.']);
            }

            return back()->with('success', 'Réservation modifiée avec succès.');
        } catch (\Throwable $e) {
            return back()->withErrors(['stock' => $e->getMessage()]);
        }
    }

    public function destroy(int $id, Request $request)
    {
        $deleted = $this->reservationService->delete($id, $request);

        if (!$deleted) {
            return back()->withErrors(['reservation' => 'Réservation introuvable ou déjà traitée.']);
        }

        return back()->with('success', 'Réservation supprimée. Le stock réservé a été libéré.');
    }
}
