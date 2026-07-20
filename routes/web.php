<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing/Index');
})->name('home');

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
| User Management (CRUD)
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Administrateur Local
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-admin-local', function () {
    return Inertia::render('Dashboard/LocalAdmin/Index', [
        'user' => [
            'name' => 'Youssef Benali',
            'email' => 'y.benali@supdata.ma',
            'role' => 'Administrateur Local',
        ],
    ]);
})->name('local-admin.dashboard');

Route::get('/demandes', function () {
    return Inertia::render('Demandes/Index');
})->name('demandes');

Route::get('/demandes/{id}', function ($id) {
    return Inertia::render('Demandes/Show', ['demandeId' => $id]);
})->name('demandes.show');

/*
|--------------------------------------------------------------------------
| Gestion Administrative
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-administrative', function () {
    return Inertia::render('Dashboard/Administrative/Index', [
        'user' => [
            'name' => 'Fatima Zahra El Mansouri',
            'email' => 'f.elmansouri@supdata.ma',
            'role' => 'Gestion Administrative',
        ],
    ]);
})->name('administrative.dashboard');

/*
|--------------------------------------------------------------------------
| Responsable Commercial
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-commercial', function () {
    return Inertia::render('Dashboard/Commercial/Index', [
        'user' => [
            'name' => 'Karim Benjelloun',
            'email' => 'k.benjelloun@supdata.ma',
            'role' => 'Responsable Commercial',
        ],
    ]);
})->name('commercial.dashboard');

/*
|--------------------------------------------------------------------------
| Responsable Stock
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-stock', function () {
    return Inertia::render('Dashboard/Stock/Index', [
        'user' => [
            'name' => 'Rachid Amrani',
            'email' => 'r.amrani@supdata.ma',
            'role' => 'Responsable Stock',
        ],
    ]);
})->name('stock.dashboard');

Route::get('/stock', function () {
    return Inertia::render('Stock/Index');
})->name('stock');

Route::get('/stock/{id}', function ($id) {
    return Inertia::render('Stock/Show', ['productId' => (int) $id]);
})->name('stock.show');

/*
|--------------------------------------------------------------------------
| Profil
|--------------------------------------------------------------------------
*/

Route::get('/profil', [ProfileController::class, 'index'])->name('profile');
Route::put('/profil', [ProfileController::class, 'update'])->name('profile.update');
Route::patch('/profil/password', [ProfileController::class, 'changePassword'])->name('profile.password');

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Super Admin
|--------------------------------------------------------------------------
*/

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

Route::middleware('auth')->group(function () {
    Route::get('/dashboard-super-admin/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('sa.notifications.unread-count');
    Route::get('/dashboard-super-admin/notifications', [NotificationController::class, 'index'])->name('sa.notifications');
    Route::patch('/dashboard-super-admin/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('sa.notifications.read-all');
    Route::patch('/dashboard-super-admin/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('sa.notifications.read');
    Route::delete('/dashboard-super-admin/notifications/read', [NotificationController::class, 'destroyAllRead'])->name('sa.notifications.destroy-all-read');
    Route::delete('/dashboard-super-admin/notifications/{notification}', [NotificationController::class, 'destroy'])->name('sa.notifications.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard-super-admin/audit-logs', [AuditLogController::class, 'index'])->name('sa.audit-logs');
});

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Administrateur Local
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-admin-local/demandes', function () {
    return Inertia::render('Demandes/Index');
})->name('al.demandes');

Route::get('/dashboard-admin-local/demandes/{id}', function ($id) {
    return Inertia::render('Demandes/Show', ['demandeId' => $id]);
})->name('al.demandes.show');

Route::get('/dashboard-admin-local/stock', function () {
    return Inertia::render('Stock/Index');
})->name('al.stock');

Route::get('/dashboard-admin-local/stock/{id}', function ($id) {
    return Inertia::render('Stock/Show', ['productId' => (int) $id]);
})->name('al.stock.show');

Route::get('/dashboard-admin-local/rapports', function () {
    return Inertia::render('Dashboard/LocalAdmin/Reports/Index');
})->name('al.reports');

Route::get('/dashboard-admin-local/notifications', function () {
    return Inertia::render('Dashboard/LocalAdmin/Notifications/Index');
})->name('al.notifications');

Route::get('/dashboard-admin-local/historique', function () {
    return Inertia::render('Dashboard/LocalAdmin/History/Index');
})->name('al.history');

Route::get('/dashboard-admin-local/parametres', function () {
    return Inertia::render('Dashboard/LocalAdmin/Settings/Index');
})->name('al.settings');

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Gestion Administrative
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-administrative/rapports', function () {
    return Inertia::render('Dashboard/Reports/Index');
})->name('ga.reports');

Route::get('/dashboard-administrative/notifications', function () {
    return Inertia::render('Dashboard/Notifications/Index');
})->name('ga.notifications');

Route::get('/dashboard-administrative/parametres', function () {
    return Inertia::render('Dashboard/Settings/Index');
})->name('ga.settings');

Route::get('/dashboard-administrative/documents', function () {
    return Inertia::render('Operations/Index', ['module' => 'documents']);
})->name('ga.documents');

Route::get('/dashboard-administrative/notes-service', function () {
    return Inertia::render('Operations/Index', ['module' => 'notes']);
})->name('ga.notes');

Route::get('/dashboard-administrative/contrats', function () {
    return Inertia::render('Operations/Index', ['module' => 'contrats']);
})->name('ga.contracts');

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Responsable Commercial
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-commercial/demandes', function () {
    return Inertia::render('Commercial/Demandes/Index');
})->name('rc.demandes');

Route::get('/dashboard-commercial/demandes/creer', function () {
    return Inertia::render('Commercial/Demandes/Create');
})->name('rc.demandes.create');

Route::get('/dashboard-commercial/demandes/{id}', function ($id) {
    return Inertia::render('Commercial/Demandes/Show', ['demandeId' => $id]);
})->name('rc.demandes.show');

Route::get('/dashboard-commercial/stock', function () {
    return Inertia::render('Commercial/Stock/Index');
})->name('rc.stock');

Route::get('/dashboard-commercial/reservations', function () {
    return Inertia::render('Commercial/Reservations/Index');
})->name('rc.reservations');

Route::get('/dashboard-commercial/rapports', function () {
    return Inertia::render('Dashboard/Commercial/Reports');
})->name('rc.reports');

Route::get('/dashboard-commercial/notifications', function () {
    return Inertia::render('Dashboard/Commercial/Notifications');
})->name('rc.notifications');

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Responsable Stock
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-stock/stock', function () {
    return Inertia::render('Stock/Index');
})->name('rs.stock');

Route::get('/dashboard-stock/stock/{id}', function ($id) {
    return Inertia::render('Stock/Show', ['productId' => (int) $id]);
})->whereNumber('id')->name('rs.stock.show');

Route::get('/dashboard-stock/rapports', function () {
    return Inertia::render('Dashboard/Reports/Index');
})->name('rs.reports');

Route::get('/dashboard-stock/notifications', function () {
    return Inertia::render('Dashboard/Notifications/Index');
})->name('rs.notifications');

Route::get('/dashboard-stock/stock/entrees', function () {
    return Inertia::render('Operations/Index', ['module' => 'entrees']);
})->name('rs.stock.entries');

Route::get('/dashboard-stock/stock/sorties', function () {
    return Inertia::render('Operations/Index', ['module' => 'sorties']);
})->name('rs.stock.exits');

Route::get('/dashboard-stock/stock/alertes', function () {
    return Inertia::render('Operations/Index', ['module' => 'alertes']);
})->name('rs.stock.alerts');

Route::get('/dashboard-stock/stock/inventaire', function () {
    return Inertia::render('Operations/Index', ['module' => 'inventaire']);
})->name('rs.stock.inventory');

Route::get('/dashboard-stock/commandes', function () {
    return Inertia::render('Operations/Index', ['module' => 'commandes']);
})->name('rs.orders');
