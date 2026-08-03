<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommercialDashboardController;
use App\Http\Controllers\CommercialStockController;
use App\Http\Controllers\LocalAdminDashboardController;
use App\Http\Controllers\LocalAdminDemandeController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AdministrativeDashboardController;
use App\Http\Controllers\StockDashboardController;
use App\Http\Controllers\AdministrativeRecordController;
use App\Http\Controllers\InventoryController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing/Index');
})->name('home');

if (app()->isLocal()) {
    Route::get('/preview/dashboard-administrative', [AdministrativeDashboardController::class, 'index'])
        ->name('preview.administrative.dashboard');
    Route::get('/preview/dashboard-stock', [StockDashboardController::class, 'index'])
        ->name('preview.stock.dashboard');
}

Route::get('/dashboard', function (Request $request) {
    return match ($request->user()->role?->slug) {
        'super-admin' => redirect()->route('super-admin.dashboard'),
        'admin-local' => redirect()->route('local-admin.dashboard'),
        'gestion-administrative' => redirect()->route('administrative.dashboard'),
        'responsable-stock' => redirect()->route('stock.dashboard'),
        default => redirect()->route('commercial.dashboard'),
    };
})->middleware('auth')->name('dashboard');

/*
|--------------------------------------------------------------------------
| Super Admin
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/dashboard-super-admin', [DashboardController::class, 'index'])->name('super-admin.dashboard');
});

/*
|--------------------------------------------------------------------------
| User Management (CRUD) — Super Admin Only
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/utilisateurs/creer', [UserController::class, 'create'])->name('users.create');
    Route::post('/utilisateurs', [UserController::class, 'store'])->name('users.store');
    Route::get('/utilisateurs', [UserController::class, 'index'])->name('users');
    Route::get('/utilisateurs/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('/utilisateurs/{user}/modifier', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/utilisateurs/{user}', [UserController::class, 'update'])->name('users.update');
    Route::patch('/utilisateurs/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::delete('/utilisateurs/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/roles-permissions', function () {
        return Inertia::render('Roles/Index');
    })->name('roles');

    Route::get('/roles/{id}', function ($id) {
        return Inertia::render('Roles/Show', ['roleId' => (int) $id]);
    })->name('roles.show');

    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs');

    Route::get('/notifications', function () {
        return Inertia::render('Dashboard/Notifications/Index');
    })->name('notifications');
});

/*
|--------------------------------------------------------------------------
| Administrateur Local
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin_local'])->group(function () {
    Route::get('/dashboard-admin-local', [LocalAdminDashboardController::class, 'index'])->name('local-admin.dashboard');
    Route::get('/dashboard-admin-local/demandes', [LocalAdminDemandeController::class, 'index'])->name('demandes');
    Route::post('/dashboard-admin-local/demandes/{id}/confirmer', [LocalAdminDemandeController::class, 'confirm'])->name('demandes.confirm');
    Route::post('/dashboard-admin-local/demandes/{id}/rejeter', [LocalAdminDemandeController::class, 'reject'])->name('demandes.reject');
    Route::get('/dashboard-admin-local/demandes/{id}', [LocalAdminDemandeController::class, 'show'])->name('demandes.show');
});

/*
|--------------------------------------------------------------------------
| Gestion Administrative
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:gestion_administrative'])->group(function () {
Route::get('/dashboard-administrative/{type}', [AdministrativeRecordController::class, 'index'])->whereIn('type', ['documents', 'notes', 'contrats'])->name('ga.records');
Route::post('/dashboard-administrative/{type}', [AdministrativeRecordController::class, 'store'])->whereIn('type', ['documents', 'notes', 'contrats'])->name('ga.records.store');
Route::put('/dashboard-administrative/{type}/{record}', [AdministrativeRecordController::class, 'update'])->whereIn('type', ['documents', 'notes', 'contrats'])->name('ga.records.update');
Route::delete('/dashboard-administrative/{type}/{record}', [AdministrativeRecordController::class, 'destroy'])->whereIn('type', ['documents', 'notes', 'contrats'])->name('ga.records.destroy');
Route::get('/dashboard-administrative/notifications', [NotificationController::class, 'index'])->name('ga.notifications');
Route::get('/dashboard-administrative/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('ga.notifications.unread-count');
Route::patch('/dashboard-administrative/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('ga.notifications.read-all');
Route::patch('/dashboard-administrative/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('ga.notifications.read');
Route::delete('/dashboard-administrative/notifications/read', [NotificationController::class, 'destroyAllRead'])->name('ga.notifications.destroy-all-read');
Route::delete('/dashboard-administrative/notifications/{notification}', [NotificationController::class, 'destroy'])->name('ga.notifications.destroy');
    Route::get('/dashboard-administrative', [AdministrativeDashboardController::class, 'index'])->name('administrative.dashboard');
});

/*
|--------------------------------------------------------------------------
| Responsable Commercial
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/dashboard-commercial', [CommercialDashboardController::class, 'index'])->name('commercial.dashboard');
    Route::get('/dashboard-commercial/demandes', [DemandeController::class, 'index'])->name('rc.demandes');
    Route::get('/dashboard-commercial/demandes/creer', [DemandeController::class, 'create'])->name('rc.demandes.create');
    Route::post('/dashboard-commercial/demandes', [DemandeController::class, 'store'])->name('rc.demandes.store');
    Route::post('/dashboard-commercial/demandes/{id}/archiver', [DemandeController::class, 'archive'])->name('rc.demandes.archive');
    Route::get('/dashboard-commercial/demandes/{id}', [DemandeController::class, 'show'])->name('rc.demandes.show');
    Route::get('/dashboard-commercial/stock', [CommercialStockController::class, 'index'])->name('rc.stock');
    Route::get('/dashboard-commercial/reservations', [ReservationController::class, 'index'])->name('rc.reservations');
    Route::post('/dashboard-commercial/reservations', [ReservationController::class, 'store'])->name('rc.reservations.store');
    Route::put('/dashboard-commercial/reservations/{id}', [ReservationController::class, 'update'])->name('rc.reservations.update');
    Route::delete('/dashboard-commercial/reservations/{id}', [ReservationController::class, 'destroy'])->name('rc.reservations.destroy');
    Route::get('/dashboard-commercial/notifications', [NotificationController::class, 'commercialIndex'])->name('rc.notifications');
    Route::get('/dashboard-commercial/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('rc.notifications.unread-count');
    Route::patch('/dashboard-commercial/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('rc.notifications.read-all');
    Route::patch('/dashboard-commercial/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('rc.notifications.read');
    Route::delete('/dashboard-commercial/notifications/read', [NotificationController::class, 'destroyAllRead'])->name('rc.notifications.destroy-all-read');
    Route::delete('/dashboard-commercial/notifications/{notification}', [NotificationController::class, 'destroy'])->name('rc.notifications.destroy');
});

/*
|--------------------------------------------------------------------------
| Responsable Stock
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:responsable_stock'])->group(function () {
Route::get('/dashboard-stock/notifications', [NotificationController::class, 'index'])->name('rs.notifications');
Route::get('/dashboard-stock/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('rs.notifications.unread-count');
Route::patch('/dashboard-stock/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('rs.notifications.read-all');
Route::patch('/dashboard-stock/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('rs.notifications.read');
Route::delete('/dashboard-stock/notifications/read', [NotificationController::class, 'destroyAllRead'])->name('rs.notifications.destroy-all-read');
Route::delete('/dashboard-stock/notifications/{notification}', [NotificationController::class, 'destroy'])->name('rs.notifications.destroy');
    Route::get('/dashboard-stock', [StockDashboardController::class, 'index'])->name('stock.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/stock', function () {
        return Inertia::render('Stock/Index');
    })->name('stock');

    Route::get('/stock/{id}', function ($id) {
        return Inertia::render('Stock/Show', ['productId' => (int) $id]);
    })->name('stock.show');
});

/*
|--------------------------------------------------------------------------
| Profil
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profil', [ProfileController::class, 'index'])->name('profile');
    Route::put('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profil/password', [ProfileController::class, 'changePassword'])->name('profile.password');
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::patch('/profile', [ProfileController::class, 'standardUpdate']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Super Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/dashboard-super-admin/utilisateurs/creer', [UserController::class, 'create'])->name('sa.users.create');
    Route::post('/dashboard-super-admin/utilisateurs', [UserController::class, 'store'])->name('sa.users.store');
    Route::get('/dashboard-super-admin/utilisateurs', [UserController::class, 'index'])->name('sa.users');
    Route::get('/dashboard-super-admin/utilisateurs/{user}', [UserController::class, 'show'])->name('sa.users.show');
    Route::get('/dashboard-super-admin/utilisateurs/{user}/modifier', [UserController::class, 'edit'])->name('sa.users.edit');
    Route::put('/dashboard-super-admin/utilisateurs/{user}', [UserController::class, 'update'])->name('sa.users.update');
    Route::patch('/dashboard-super-admin/utilisateurs/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('sa.users.toggle-status');
    Route::delete('/dashboard-super-admin/utilisateurs/{user}', [UserController::class, 'destroy'])->name('sa.users.destroy');

    Route::get('/dashboard-super-admin/roles-permissions', function () {
        return Inertia::render('Roles/Index');
    })->name('sa.roles');

    Route::get('/dashboard-super-admin/roles/{id}', function ($id) {
        return Inertia::render('Roles/Show', ['roleId' => (int) $id]);
    })->name('sa.roles.show');

    Route::get('/dashboard-super-admin/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('sa.notifications.unread-count');
    Route::get('/dashboard-super-admin/notifications', [NotificationController::class, 'index'])->name('sa.notifications');
    Route::patch('/dashboard-super-admin/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('sa.notifications.read-all');
    Route::patch('/dashboard-super-admin/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('sa.notifications.read');
    Route::delete('/dashboard-super-admin/notifications/read', [NotificationController::class, 'destroyAllRead'])->name('sa.notifications.destroy-all-read');
    Route::delete('/dashboard-super-admin/notifications/{notification}', [NotificationController::class, 'destroy'])->name('sa.notifications.destroy');

    Route::get('/dashboard-super-admin/audit-logs', [AuditLogController::class, 'index'])->name('sa.audit-logs');
});

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Administrateur Local
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin_local'])->group(function () {
    Route::get('/dashboard-admin-local/stock', [\App\Http\Controllers\LocalAdminStockController::class, 'index'])->name('al.stock');

    Route::patch('/dashboard-admin-local/stock/categories/seuils', [\App\Http\Controllers\LocalAdminStockController::class, 'updateCategoryThresholds'])->name('al.stock.categories.thresholds');

    Route::patch('/dashboard-admin-local/stock/{id}/seuils', [\App\Http\Controllers\LocalAdminStockController::class, 'updateThresholds'])->name('al.stock.thresholds');

    Route::get('/dashboard-admin-local/stock/{id}', [\App\Http\Controllers\LocalAdminStockController::class, 'show'])->name('al.stock.show');

    Route::get('/dashboard-admin-local/notifications', [\App\Http\Controllers\NotificationController::class, 'localAdminIndex'])->name('al.notifications');
    Route::get('/dashboard-admin-local/notifications/unread-count', [\App\Http\Controllers\NotificationController::class, 'unreadCount'])->name('al.notifications.unread-count');
    Route::patch('/dashboard-admin-local/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('al.notifications.read-all');
    Route::patch('/dashboard-admin-local/notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('al.notifications.read');
    Route::delete('/dashboard-admin-local/notifications/read', [\App\Http\Controllers\NotificationController::class, 'destroyAllRead'])->name('al.notifications.destroy-all-read');
    Route::delete('/dashboard-admin-local/notifications/{notification}', [\App\Http\Controllers\NotificationController::class, 'destroy'])->name('al.notifications.destroy');

    Route::get('/dashboard-admin-local/historique', [\App\Http\Controllers\LocalAdminHistoryController::class, 'index'])->name('al.history');
});

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Gestion Administrative
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:gestion_administrative'])->group(function () {
Route::get('/dashboard-administrative/demandes', fn (Request $request) => app(AdministrativeDashboardController::class)->operations('demandes', $request))->name('ga.requests');

Route::get('/dashboard-administrative/stock', fn (Request $request) => app(AdministrativeDashboardController::class)->operations('stock', $request))->name('ga.stock');

Route::get('/dashboard-administrative/validations', fn (Request $request) => app(AdministrativeDashboardController::class)->operations('validations', $request))->name('ga.validations');

Route::get('/dashboard-administrative/demandes-acceptees', [AdministrativeDashboardController::class, 'approved'])->name('ga.approved-requests');
Route::post('/dashboard-administrative/demandes/{id}/decision', [AdministrativeDashboardController::class, 'decide'])->name('ga.requests.decide');

Route::redirect('/dashboard-administrative/commandes-fournisseurs', '/dashboard-administrative/demandes-acceptees');
});

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Responsable Stock
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:responsable_stock'])->group(function () {
Route::get('/dashboard-stock/produits', fn (Request $request) => app(StockDashboardController::class)->operations('produits', $request))->name('rs.products');

Route::get('/dashboard-stock/categories', fn (Request $request) => app(StockDashboardController::class)->operations('categories', $request))->name('rs.categories');

Route::get('/dashboard-stock/mouvements', fn (Request $request) => app(StockDashboardController::class)->operations('mouvements', $request))->name('rs.movements');

Route::get('/dashboard-stock/livraisons', fn (Request $request) => app(StockDashboardController::class)->operations('livraisons', $request))->name('rs.deliveries');

Route::get('/dashboard-stock/alertes', fn (Request $request) => app(StockDashboardController::class)->operations('alertes', $request))->name('rs.alerts');
Route::post('/dashboard-stock/mouvement', [StockDashboardController::class, 'movement'])->name('rs.movement.store');
Route::patch('/dashboard-stock/receptions/{id}/valider', [StockDashboardController::class, 'validateReception'])->name('rs.receptions.validate');
Route::patch('/dashboard-stock/livraisons/{id}/livrer', [StockDashboardController::class, 'deliverLivraison'])->name('rs.livraisons.deliver');
Route::patch('/dashboard-stock/livraisons/{id}/annuler', [StockDashboardController::class, 'cancelLivraison'])->name('rs.livraisons.cancel');
Route::patch('/dashboard-stock/alertes/{productId}/traiter', [StockDashboardController::class, 'resolveAlert'])->name('rs.alerts.resolve');

Route::get('/dashboard-stock/inventaires', [InventoryController::class, 'index'])->name('rs.inventaires.index');
Route::post('/dashboard-stock/inventaires', [InventoryController::class, 'store'])->name('rs.inventaires.store');
Route::get('/dashboard-stock/inventaires/{inventory}', [InventoryController::class, 'show'])->name('rs.inventaires.show');
Route::put('/dashboard-stock/inventaires/{inventory}', [InventoryController::class, 'update'])->name('rs.inventaires.update');
Route::patch('/dashboard-stock/inventaires/{inventory}/terminer', [InventoryController::class, 'terminate'])->name('rs.inventaires.terminate');
Route::delete('/dashboard-stock/inventaires/{inventory}', [InventoryController::class, 'destroy'])->name('rs.inventaires.destroy');
Route::get('/dashboard-stock/inventaires/{inventory}/export/{format}', [InventoryController::class, 'export'])
    ->whereIn('format', ['csv', 'excel'])->name('rs.inventaires.export');

Route::post('/dashboard-stock/{section}', [StockDashboardController::class, 'store'])->name('rs.operations.store');
Route::put('/dashboard-stock/{section}/{id}', [StockDashboardController::class, 'update'])->name('rs.operations.update');
Route::delete('/dashboard-stock/{section}/{id}', [StockDashboardController::class, 'destroy'])->name('rs.operations.destroy');
});
