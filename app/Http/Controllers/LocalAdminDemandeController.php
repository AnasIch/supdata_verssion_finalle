<?php

namespace App\Http\Controllers;

use App\Mail\DemandeConfirmedMail;
use App\Mail\DemandeRejectedMail;
use App\Models\Demande;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditLogService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class LocalAdminDemandeController extends Controller
{
    public function __construct(
        private AuditLogService $auditLogService,
        private NotificationService $notificationService,
    ) {}

    public function index(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $query = Demande::whereIn('status', ['pending_local_admin', 'confirmed_local_admin', 'rejected_local_admin'])
            ->with(['user', 'agency', 'confirmedBy']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        $query->orderBy('created_at', 'desc');

        $demandes = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => Demande::whereIn('status', ['pending_local_admin', 'confirmed_local_admin', 'rejected_local_admin'])->count(),
            'pending' => Demande::where('status', 'pending_local_admin')->count(),
            'confirmed' => Demande::where('status', 'confirmed_local_admin')->count(),
            'rejected' => Demande::where('status', 'rejected_local_admin')->count(),
        ];

        return Inertia::render('Demandes/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Administrateur Local',
                'agency' => $user->agency->name ?? '—',
            ],
            'demandes' => $demandes->items(),
            'demandesMeta' => [
                'currentPage' => $demandes->currentPage(),
                'lastPage' => $demandes->lastPage(),
                'total' => $demandes->total(),
                'perPage' => $demandes->perPage(),
            ],
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function show(int $id, Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'agency']);

        $demande = Demande::where('id', $id)
            ->with(['user', 'agency', 'confirmedBy', 'refusedBy'])
            ->first();

        if (!$demande) {
            return back()->withErrors(['demande' => 'Demande introuvable.']);
        }

        $this->auditLogService->log(
            user: $user,
            action: 'Consultation',
            module: 'Demandes',
            description: "Consultation de la demande « {$demande->title} »",
            target: $demande->title,
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        $auditLogs = \App\Models\AuditLog::where('module', 'Demandes')
            ->where('target', $demande->title)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user' => $log->user->name ?? 'Système',
                'created_at' => $log->created_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
            ]);

        return Inertia::render('Demandes/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? 'Administrateur Local',
                'agency' => $user->agency->name ?? '—',
            ],
            'demande' => [
                'id' => $demande->id,
                'title' => $demande->title,
                'description' => $demande->description,
                'status' => $demande->status,
                'priority' => $demande->priority,
                'quantity' => $demande->quantity,
                'product_name' => $demande->product_name,
                'products' => $demande->products ?? [],
                'created_at' => $demande->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'created_at_full' => $demande->created_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'updated_at' => $demande->updated_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'requester' => $demande->user->name ?? '—',
                'agency_name' => $demande->agency->name ?? '—',
                'confirmedBy' => $demande->confirmedBy?->name,
                'confirmed_at' => $demande->confirmed_at?->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'refuser' => $demande->refusedBy?->name,
                'refused_at' => $demande->refused_at?->locale('fr')->isoFormat('DD MMM YYYY — HH:mm'),
                'rejection_reason' => $demande->refusal_reason,
            ],
            'auditLogs' => $auditLogs,
        ]);
    }

    public function confirm(int $id, Request $request)
    {
        $user = $request->user();

        $demande = Demande::where('id', $id)
            ->where('status', 'pending_local_admin')
            ->with(['user', 'agency'])
            ->first();

        if (!$demande) {
            return back()->withErrors(['demande' => 'Demande introuvable ou déjà traitée.']);
        }

        DB::transaction(function () use ($demande, $user) {
            $demande->update([
                'status' => 'confirmed_local_admin',
                'confirmed_by' => $user->id,
                'confirmed_at' => now(),
            ]);

            $this->auditLogService->log(
                user: $user,
                action: 'Confirmation',
                module: 'Demandes',
                description: "Confirmation de la demande d'achat {$demande->title}",
                target: $demande->title,
                oldValues: ['statut' => 'pending_local_admin'],
                newValues: ['statut' => 'confirmed_local_admin'],
                ipAddress: request()->ip(),
                userAgent: request()->userAgent(),
            );
        });

        $this->notifyDemandeur($demande, $user, 'confirmed');
        $this->notifyOnConfirm($demande, $user);
        $this->notifySelf($demande, $user, 'confirmed');

        try {
            $this->sendConfirmEmails($demande, $user);
        } catch (\Throwable $e) {
            Log::error("Erreur envoi email confirmation demande {$demande->id}: {$e->getMessage()}");
        }

        return back()->with('success', 'La demande a été confirmée avec succès.');
    }

    public function reject(int $id, Request $request)
    {
        $user = $request->user();

        $request->validate([
            'reason' => 'required|string|min:20',
        ]);

        $demande = Demande::where('id', $id)
            ->where('status', 'pending_local_admin')
            ->with(['user', 'agency'])
            ->first();

        if (!$demande) {
            return back()->withErrors(['demande' => 'Demande introuvable ou déjà traitée.']);
        }

        DB::transaction(function () use ($demande, $user, $request) {
            $demande->update([
                'status' => 'rejected_local_admin',
                'refused_by' => $user->id,
                'refused_at' => now(),
                'refusal_reason' => $request->reason,
            ]);

            $this->auditLogService->log(
                user: $user,
                action: 'Rejet',
                module: 'Demandes',
                description: "Rejet de la demande d'achat {$demande->title} — Motif : {$request->reason}",
                target: $demande->title,
                oldValues: ['statut' => 'pending_local_admin'],
                newValues: ['statut' => 'rejected_local_admin', 'motif' => $request->reason],
                ipAddress: request()->ip(),
                userAgent: request()->userAgent(),
            );
        });

        $this->notifyDemandeur($demande, $user, 'rejected', $request->reason);
        $this->notifyOnReject($demande, $user, $request->reason);
        $this->notifySelf($demande, $user, 'rejected');

        try {
            $this->sendRejectEmails($demande, $user, $request->reason);
        } catch (\Throwable $e) {
            Log::error("Erreur envoi email rejet demande {$demande->id}: {$e->getMessage()}");
        }

        return back()->with('success', 'La demande a été rejetée.');
    }

    private function notifyDemandeur(Demande $demande, User $admin, string $action, ?string $reason = null): void
    {
        try {
            $demandeur = $demande->user;
            if (!$demandeur) return;

            $titles = [
                'confirmed' => 'Demande confirmée',
                'rejected' => 'Demande rejetée',
            ];

            $descriptions = [
                'confirmed' => "Votre demande « {$demande->title} » a été confirmée par {$admin->name}. Elle sera traitée par le Responsable Stock.",
                'rejected' => "Votre demande « {$demande->title} » a été rejetée. Motif : {$reason}",
            ];

            $types = [
                'confirmed' => 'success',
                'rejected' => 'warning',
            ];

            $this->notificationService->create(
                user: $demandeur,
                title: $titles[$action],
                description: $descriptions[$action],
                type: $types[$action],
                source: 'demandes',
                actionUrl: "/dashboard-commercial/demandes/{$demande->id}",
            );
        } catch (\Throwable $e) {
            Log::error("Erreur notification demande {$demande->id}: {$e->getMessage()}");
        }
    }

    private function notifyOnConfirm(Demande $demande, User $admin): void
    {
        try {
            $rcRole = Role::where('name', 'Responsable Commercial')->first();

            if (!$rcRole) return;

            $users = User::where('role_id', $rcRole->id)
                ->where('agency_id', $demande->agency_id)
                ->where('status', 'active')
                ->get();

            foreach ($users as $recipient) {
                $this->notificationService->create(
                    user: $recipient,
                    title: 'Demande confirmée',
                    description: "La demande « {$demande->title} » a été confirmée par l'Administrateur Local {$admin->name}. Elle est maintenant transmise au Responsable Stock.",
                    type: 'success',
                    source: 'demandes',
                    actionUrl: "/dashboard-commercial/demandes/{$demande->id}",
                );
            }
        } catch (\Throwable $e) {
            Log::error("Erreur notification confirmation demande {$demande->id}: {$e->getMessage()}");
        }
    }

    private function notifyOnReject(Demande $demande, User $admin, string $reason): void
    {
        try {
            $rcRole = Role::where('name', 'Responsable Commercial')->first();

            if (!$rcRole) return;

            $users = User::where('role_id', $rcRole->id)
                ->where('agency_id', $demande->agency_id)
                ->where('status', 'active')
                ->get();

            foreach ($users as $recipient) {
                $this->notificationService->create(
                    user: $recipient,
                    title: 'Demande rejetée',
                    description: "La demande « {$demande->title} » a été rejetée par l'Administrateur Local {$admin->name}. Motif : {$reason}",
                    type: 'warning',
                    source: 'demandes',
                    actionUrl: "/dashboard-commercial/demandes/{$demande->id}",
                );
            }
        } catch (\Throwable $e) {
            Log::error("Erreur notification rejet demande {$demande->id}: {$e->getMessage()}");
        }
    }

    private function sendConfirmEmails(Demande $demande, User $admin): void
    {
        $rcRole = Role::where('name', 'Responsable Commercial')->first();

        if (!$rcRole) return;

        $users = User::where('role_id', $rcRole->id)
            ->where('agency_id', $demande->agency_id)
            ->where('status', 'active')
            ->get();

        foreach ($users as $recipient) {
            Mail::to($recipient->email)->send(
                new DemandeConfirmedMail($demande, $admin)
            );
        }
    }

    private function sendRejectEmails(Demande $demande, User $admin, string $reason): void
    {
        $rcRole = Role::where('name', 'Responsable Commercial')->first();

        if (!$rcRole) return;

        $users = User::where('role_id', $rcRole->id)
            ->where('agency_id', $demande->agency_id)
            ->where('status', 'active')
            ->get();

        foreach ($users as $recipient) {
            Mail::to($recipient->email)->send(
                new DemandeRejectedMail($demande, $admin, $reason)
            );
        }
    }

    private function notifySelf(Demande $demande, User $admin, string $action): void
    {
        try {
            $titles = [
                'confirmed' => 'Demande confirmée',
                'rejected' => 'Demande rejetée',
            ];

            $descriptions = [
                'confirmed' => "Vous avez confirmé la demande « {$demande->title} ». Elle sera traitée par le Responsable Stock.",
                'rejected' => "Vous avez rejeté la demande « {$demande->title} ».",
            ];

            $types = [
                'confirmed' => 'success',
                'rejected' => 'warning',
            ];

            $this->notificationService->create(
                user: $admin,
                title: $titles[$action],
                description: $descriptions[$action],
                type: $types[$action],
                source: 'demandes',
                actionUrl: "/dashboard-admin-local/demandes/{$demande->id}",
            );
        } catch (\Throwable $e) {
            Log::error("Erreur notification self demande {$demande->id}: {$e->getMessage()}");
        }
    }
}
