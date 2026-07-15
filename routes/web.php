<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing/Index');
})->name('home');

Route::get('/ui-showcase', function () {
    return Inertia::render('Development/UIShowcase');
})->name('ui-showcase');

/*
|--------------------------------------------------------------------------
| Super Admin
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-super-admin', function () {
    return Inertia::render('Dashboard/SuperAdmin/Index', [
        'user' => [
            'name' => 'Super Admin',
            'email' => 'admin@supdata.fr',
            'role' => 'Super Admin',
        ],
    ]);
})->name('super-admin.dashboard');

Route::get('/utilisateurs/creer', function () {
    return Inertia::render('Users/Create');
})->name('users.create');

Route::get('/utilisateurs/{id}/modifier', function ($id) {
    return Inertia::render('Users/Edit', ['userId' => (int) $id]);
})->name('users.edit');

Route::get('/utilisateurs/{id}', function ($id) {
    return Inertia::render('Users/Show', ['userId' => (int) $id]);
})->name('users.show');

Route::get('/utilisateurs', function () {
    return Inertia::render('Users/Index');
})->name('users');

Route::get('/roles-permissions', function () {
    return Inertia::render('Roles/Index');
})->name('roles');

Route::get('/roles/{id}', function ($id) {
    return Inertia::render('Roles/Show', ['roleId' => (int) $id]);
})->name('roles.show');

Route::get('/agences', function () {
    return Inertia::render('Agences/Index');
})->name('agences');

Route::get('/agences/{id}/modifier', function ($id) {
    return Inertia::render('Agencies/Edit', ['agencyId' => (int) $id]);
})->name('agences.edit');

Route::get('/agences/{id}', function ($id) {
    return Inertia::render('Agencies/Show', ['agencyId' => (int) $id]);
})->name('agences.show');

Route::get('/permissions', function () {
    return Inertia::render('Permissions/Index');
})->name('permissions');

Route::get('/permissions/{roleId}', function ($roleId) {
    return Inertia::render('Permissions/Show', ['roleId' => (int) $roleId]);
})->name('permissions.show');

Route::get('/rapports', function () {
    return Inertia::render('Dashboard/Reports/Index');
})->name('reports');

Route::get('/audit-logs', function () {
    return Inertia::render('Dashboard/AuditLogs/Index');
})->name('audit-logs');

Route::get('/notifications', function () {
    return Inertia::render('Dashboard/Notifications/Index');
})->name('notifications');

Route::get('/parametres', function () {
    return Inertia::render('Dashboard/Settings/Index');
})->name('settings');

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

Route::get('/profil', function () {
    return Inertia::render('Profile/Index');
})->name('profile');

/*
|--------------------------------------------------------------------------
| Role-Specific Routes — Super Admin
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-super-admin/utilisateurs/creer', function () {
    return Inertia::render('Users/Create');
})->name('sa.users.create');

Route::get('/dashboard-super-admin/utilisateurs/{id}/modifier', function ($id) {
    return Inertia::render('Users/Edit', ['userId' => (int) $id]);
})->name('sa.users.edit');

Route::get('/dashboard-super-admin/utilisateurs/{id}', function ($id) {
    return Inertia::render('Users/Show', ['userId' => (int) $id]);
})->name('sa.users.show');

Route::get('/dashboard-super-admin/utilisateurs', function () {
    return Inertia::render('Users/Index');
})->name('sa.users');

Route::get('/dashboard-super-admin/roles-permissions', function () {
    return Inertia::render('Roles/Index');
})->name('sa.roles');

Route::get('/dashboard-super-admin/roles/{id}', function ($id) {
    return Inertia::render('Roles/Show', ['roleId' => (int) $id]);
})->name('sa.roles.show');

Route::get('/dashboard-super-admin/agences', function () {
    return Inertia::render('Agences/Index');
})->name('sa.agences');

Route::get('/dashboard-super-admin/agences/{id}/modifier', function ($id) {
    return Inertia::render('Agencies/Edit', ['agencyId' => (int) $id]);
})->name('sa.agences.edit');

Route::get('/dashboard-super-admin/agences/{id}', function ($id) {
    return Inertia::render('Agencies/Show', ['agencyId' => (int) $id]);
})->name('sa.agences.show');

Route::get('/dashboard-super-admin/rapports', function () {
    return Inertia::render('Dashboard/Reports/Index');
})->name('sa.reports');

Route::get('/dashboard-super-admin/notifications', function () {
    return Inertia::render('Dashboard/Notifications/Index');
})->name('sa.notifications');

Route::get('/dashboard-super-admin/audit-logs', function () {
    return Inertia::render('Dashboard/AuditLogs/Index');
})->name('sa.audit-logs');

Route::get('/dashboard-super-admin/parametres', function () {
    return Inertia::render('Dashboard/Settings/Index');
})->name('sa.settings');

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

Route::get('/dashboard-commercial/rapports', function () {
    return Inertia::render('Dashboard/Reports/Index');
})->name('rc.reports');

Route::get('/dashboard-commercial/notifications', function () {
    return Inertia::render('Dashboard/Notifications/Index');
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
