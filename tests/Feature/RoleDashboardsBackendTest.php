<?php

use App\Models\Agency;
use App\Models\Demande;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->agency = Agency::create(['name' => 'SUPDATA Casablanca', 'city' => 'Casablanca']);
    $this->user = User::factory()->create(['agency_id' => $this->agency->id]);
    $stockRole = Role::create(['name' => 'Responsable Stock', 'slug' => 'responsable-stock']);
    $adminRole = Role::create(['name' => 'Gestion Administrative', 'slug' => 'gestion-administrative']);
    $this->stockUser = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $stockRole->id]);
    $this->adminUser = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $adminRole->id]);
    $localRole = Role::create(['name' => 'Administrateur Local', 'slug' => 'admin-local']);
    $this->localUser = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $localRole->id]);
});

it('serves the stock dashboard from database records', function () {
    Product::create([
        'name' => 'Écran test', 'reference' => 'TEST-001', 'category' => 'Informatique',
        'unit_price' => 1000, 'quantity_in_stock' => 8, 'reserved_quantity' => 2,
        'minimum_stock' => 3, 'agency_id' => $this->agency->id, 'status' => 'active',
    ]);

    $this->actingAs($this->stockUser)->get('/dashboard-stock')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Stock/Index')
            ->has('dashboardData.stats', 6)
            ->has('dashboardData.products', 1));
});

it('persists a stock movement and updates product quantity', function () {
    $product = Product::create([
        'name' => 'Clavier test', 'reference' => 'TEST-002', 'category' => 'Périphériques',
        'unit_price' => 100, 'quantity_in_stock' => 10, 'reserved_quantity' => 0,
        'minimum_stock' => 2, 'agency_id' => $this->agency->id, 'status' => 'active',
    ]);

    $this->actingAs($this->stockUser)->post('/dashboard-stock/mouvement', [
        'type' => 'Sortie', 'quantity' => 3, 'product' => $product->name, 'agency' => 'Casablanca',
        'document_type' => 'Bon de livraison',
        'document_file' => \Illuminate\Http\UploadedFile::fake()->create('BL-test.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    expect($product->fresh()->quantity_in_stock)->toBe(7);
    $this->assertDatabaseHas('stock_operations', ['section' => 'mouvements', 'quantity' => 3]);
    $this->assertDatabaseHas('audit_logs', ['module' => 'Stock', 'action' => 'Mouvement']);
});

it('manages administrative documents in the database', function () {
    $this->actingAs($this->adminUser)->post('/dashboard-administrative/documents', [
        'title' => 'Procédure interne', 'description' => 'Version validée',
        'status' => 'En vigueur', 'effective_at' => '2026-07-25',
    ])->assertRedirect();

    $record = \App\Models\AdministrativeRecord::firstOrFail();
    $this->assertDatabaseHas('administrative_records', ['type' => 'documents', 'title' => 'Procédure interne']);
    $this->assertDatabaseHas('audit_logs', ['module' => 'Gestion administrative', 'action' => 'Création']);

    $this->actingAs($this->adminUser)->put("/dashboard-administrative/documents/{$record->id}", [
        'title' => 'Procédure interne révisée', 'description' => 'Version 2', 'status' => 'En vigueur',
    ])->assertRedirect();
    expect($record->fresh()->title)->toBe('Procédure interne révisée');

    $this->actingAs($this->adminUser)->delete("/dashboard-administrative/documents/{$record->id}")->assertRedirect();
    $this->assertDatabaseMissing('administrative_records', ['id' => $record->id]);
});

it('serves role notification centers and the local admin dashboard', function () {
    $this->actingAs($this->adminUser)->get('/dashboard-administrative/notifications')->assertOk();
    $this->actingAs($this->stockUser)->get('/dashboard-stock/notifications')->assertOk();
    $this->actingAs($this->localUser)->get('/dashboard-admin-local')->assertOk();
});

it('serves the administrative dashboard from demandes', function () {
    Demande::create([
        'title' => 'Nouvel équipement', 'description' => 'Test', 'user_id' => $this->user->id,
        'agency_id' => $this->agency->id, 'status' => 'pending', 'priority' => 'high',
        'quantity' => 2, 'product_name' => 'Ordinateur',
    ]);

    $this->actingAs($this->adminUser)->get('/dashboard-administrative')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Administrative/Index')
            ->has('dashboardData.requests', 1));
});

it('persists an administrative approval for local admin confirmation', function () {
    $demande = Demande::create([
        'title' => 'Demande à approuver', 'description' => 'Test', 'user_id' => $this->user->id,
        'agency_id' => $this->agency->id, 'status' => 'pending', 'priority' => 'medium',
        'quantity' => 1, 'product_name' => 'Écran',
    ]);

    $this->actingAs($this->adminUser)->post("/dashboard-administrative/demandes/{$demande->id}/decision", [
        'decision' => 'approved', 'reason' => '',
    ])->assertRedirect();

    expect($demande->fresh()->status)->toBe('approved');
    $demande->fresh()->update(['status' => 'confirmed', 'confirmed_at' => now()]);
    $this->get('/dashboard-administrative/demandes-acceptees')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Administrative/SupplierOrders')
            ->has('approvedRequests', 1));
});
