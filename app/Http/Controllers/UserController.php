<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\Role;
use App\Models\Agency;
use App\Models\User;
use App\Services\UserService;
use App\Services\NotificationService;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    private const ASSIGNABLE_ROLES = [
        'Super Admin',
        'Administrateur Local',
        'Responsable Commercial',
        'Responsable Stock',
        'Gestion Administrative',
    ];

    public function __construct(
        private NotificationService $notificationService,
        private AuditLogService $auditLogService,
    ) {}

    public function index(Request $request)
    {
        $query = User::with(['role', 'agency']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $role = Role::where('name', $request->role)->first();
            if ($role) {
                $query->where('role_id', $role->id);
            }
        }

        if ($request->filled('agency')) {
            $agency = Agency::where('city', $request->agency)->first();
            if ($agency) {
                $query->where('agency_id', $agency->id);
            }
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $allowedSorts = ['name', 'email', 'status', 'created_at'];

        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $request->get('perPage', 8);
        $users = $query->paginate($perPage);

        $allUsers = User::with(['role', 'agency'])->get();
        $stats = [
            'total' => $allUsers->count(),
            'active' => $allUsers->where('status', 'active')->count(),
            'inactive' => $allUsers->where('status', 'inactive')->count(),
            'admins' => $allUsers->filter(fn($u) => $u->role && in_array($u->role->name, ['Super Admin', 'Administrateur Local']))->count(),
        ];

        $roles = Role::all();
        $agencies = Agency::all();

        return Inertia::render('Users/Index', [
            'users' => $users->getCollection()->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->name ?? '—',
                'agency' => $user->agency->city ?? '—',
                'status' => $user->status,
                'createdAt' => $user->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
            ]),
            'pagination' => [
                'currentPage' => $users->currentPage(),
                'lastPage' => $users->lastPage(),
                'perPage' => $users->perPage(),
                'total' => $users->total(),
            ],
            'stats' => $stats,
            'roles' => $roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name]),
            'agencies' => $agencies->map(fn($a) => ['id' => $a->id, 'name' => $a->name, 'city' => $a->city]),
            'filters' => $request->only(['search', 'role', 'agency', 'status']),
        ]);
    }

    public function show(User $user)
    {
        $user->load(['role', 'agency']);

        return Inertia::render('Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? null,
                'position' => $user->position ?? null,
                'role' => $user->role->name ?? '—',
                'agency' => $user->agency->city ?? '—',
                'status' => $user->status,
                'createdAt' => $user->created_at->locale('fr')->isoFormat('DD MMM YYYY'),
                'createdAtRaw' => $user->created_at->toISOString(),
                'lastLogin' => $user->last_login_at
                    ? $user->last_login_at->locale('fr')->isoFormat('DD MMM YYYY — HH:mm')
                    : '—',
                'lastLoginRaw' => $user->last_login_at?->toISOString(),
            ],
        ]);
    }

    public function create()
    {
        $roles = Role::whereIn('name', self::ASSIGNABLE_ROLES)->get();
        $agencies = Agency::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name]),
            'agencies' => $agencies->map(fn($a) => ['id' => $a->id, 'name' => $a->name, 'city' => $a->city]),
        ]);
    }

    public function store(StoreUserRequest $request, UserService $userService)
    {
        $result = $userService->createUser($request->validated());

        $this->notificationService->create(
            auth()->user(),
            'Utilisateur créé',
            $result['user']->name . ' a été ajouté au système en tant que ' . ($result['user']->role->name ?? 'Utilisateur') . '.',
            'success',
            'utilisateurs',
            'utilisateurs',
        );

        $this->auditLogService->log(
            user: auth()->user(),
            action: 'Création',
            module: 'Utilisateurs',
            description: 'Création de l\'utilisateur ' . $result['user']->name,
            target: $result['user']->name,
            newValues: [
                'nom' => $result['user']->name,
                'email' => $result['user']->email,
                'role' => $result['user']->role?->name ?? '—',
            ],
            ipAddress: $request->ip(),
            userAgent: $request->userAgent(),
        );

        if ($result['email_sent']) {
            return redirect()->route('users')->with('success', 'Utilisateur créé avec succès. Un email de bienvenue a été envoyé à ' . $result['user']->email . '.');
        }

        $warningMessage = "L'utilisateur a été créé mais l'email de bienvenue n'a pas pu être envoyé. Veuillez contacter l'utilisateur manuellement.";

        if (config('app.debug') && $result['email_error']) {
            $warningMessage .= ' Erreur : ' . $result['email_error'];
        }

        return redirect()->route('users')->with('success', 'Utilisateur créé avec succès.')->with('warning', $warningMessage);
    }

    public function edit(User $user)
    {
        $user->load(['role', 'agency']);
        $roles = Role::whereIn('name', self::ASSIGNABLE_ROLES)->get();
        $agencies = Agency::all();

        return Inertia::render('Users/Edit', [
            'user' => [
                'id' => $user->id,
                'firstName' => explode(' ', $user->name)[0] ?? '',
                'lastName' => explode(' ', $user->name, 2)[1] ?? '',
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'agency' => $user->agency->city ?? '',
                'role' => $user->role->name ?? '',
                'status' => $user->status,
            ],
            'roles' => $roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name]),
            'agencies' => $agencies->map(fn($a) => ['id' => $a->id, 'name' => $a->name, 'city' => $a->city]),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            $oldData = [
                'nom' => $user->name,
                'email' => $user->email,
                'téléphone' => $user->phone ?? '',
                'rôle' => $user->role?->name ?? '—',
                'agence' => $user->agency?->city ?? '—',
                'statut' => $user->status,
            ];

            $data = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'role_id' => $validated['role_id'],
                'agency_id' => $validated['agency_id'],
                'status' => $validated['status'],
            ];

            if (!empty($validated['password'])) {
                $data['password'] = Hash::make($validated['password']);
            }

            $user->update($data);

            $newData = [
                'nom' => $user->name,
                'email' => $user->email,
                'téléphone' => $user->phone ?? '',
                'rôle' => $user->role?->name ?? '—',
                'agence' => $user->agency?->city ?? '—',
                'statut' => $user->status,
            ];

            $this->notificationService->create(
                auth()->user(),
                'Utilisateur modifié',
                'Les informations de ' . $user->name . ' ont été mises à jour.',
                'info',
                'utilisateurs',
                'utilisateurs',
            );

            $this->auditLogService->log(
                user: auth()->user(),
                action: 'Modification',
                module: 'Utilisateurs',
                description: 'Modification de l\'utilisateur ' . $user->name,
                target: $user->name,
                oldValues: $oldData,
                newValues: $newData,
                ipAddress: $request->ip(),
                userAgent: $request->userAgent(),
            );

            DB::commit();

            return redirect()->route('users')->with('success', 'Utilisateur modifié avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function toggleStatus(User $user)
    {
        $oldStatus = $user->status;
        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        $label = $newStatus === 'active' ? 'activé' : 'désactivé';
        $type = $newStatus === 'active' ? 'success' : 'warning';

        $this->notificationService->create(
            auth()->user(),
            'Utilisateur ' . $label,
            $user->name . ' a été ' . $label . '.',
            $type,
            'utilisateurs',
            'utilisateurs',
        );

        $this->auditLogService->log(
            user: auth()->user(),
            action: 'Modification',
            module: 'Utilisateurs',
            description: ($newStatus === 'active' ? 'Activation' : 'Désactivation') . ' de l\'utilisateur ' . $user->name,
            target: $user->name,
            oldValues: ['statut' => $oldStatus === 'active' ? 'Actif' : 'Inactif'],
            newValues: ['statut' => $newStatus === 'active' ? 'Actif' : 'Inactif'],
            ipAddress: request()->ip(),
            userAgent: request()->userAgent(),
        );

        return back()->with('success', "Utilisateur {$label} avec succès.");
    }

    public function destroy(User $user)
    {
        $name = $user->name;
        $email = $user->email;
        $role = $user->role?->name ?? '—';
        $user->delete();

        $this->notificationService->create(
            auth()->user(),
            'Utilisateur supprimé',
            $name . ' a été supprimé du système.',
            'warning',
            'utilisateurs',
            'utilisateurs',
        );

        $this->auditLogService->log(
            user: auth()->user(),
            action: 'Suppression',
            module: 'Utilisateurs',
            description: 'Suppression de l\'utilisateur ' . $email,
            target: $email,
            oldValues: [
                'nom' => $name,
                'email' => $email,
                'rôle' => $role,
            ],
            ipAddress: request()->ip(),
            userAgent: request()->userAgent(),
        );

        return back()->with('success', 'Utilisateur supprimé avec succès.');
    }
}