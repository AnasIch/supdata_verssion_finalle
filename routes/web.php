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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index', [
        'user' => [
            'name' => 'Super Admin',
            'email' => 'admin@supdata.fr',
            'role' => 'Super Admin',
        ],
    ]);
})->name('dashboard');

Route::get('/utilisateurs', function () {
    return Inertia::render('Users/Index');
})->name('users');

Route::get('/utilisateurs/creer', function () {
    return Inertia::render('Users/Create');
})->name('users.create');

Route::get('/utilisateurs/{id}/modifier', function () {
    return Inertia::render('Users/Edit');
})->name('users.edit');

Route::get('/utilisateurs/{id}', function () {
    return Inertia::render('Users/Show');
})->name('users.show');

Route::get('/roles-permissions', function () {
    return Inertia::render('Roles/Index');
})->name('roles');

Route::get('/roles/{id}', function () {
    return Inertia::render('Roles/Show');
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

Route::get('/profil', function () {
    return Inertia::render('Profile/Index');
})->name('profile');

