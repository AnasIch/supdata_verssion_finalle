<?php

use App\Models\Agency;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->agency = Agency::create(['name' => 'SUPDATA Casablanca', 'city' => 'Casablanca']);
    $stockRole = Role::create(['name' => 'Responsable Stock', 'slug' => 'responsable-stock']);
    $this->stockUser = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $stockRole->id]);
    $this->product = Product::create([
        'name' => 'Écran inventaire', 'reference' => 'INV-TEST-001', 'category' => 'Informatique',
        'unit_price' => 1000, 'quantity_in_stock' => 8, 'reserved_quantity' => 2,
        'minimum_stock' => 3, 'agency_id' => $this->agency->id, 'status' => 'active',
    ]);
});

it('creates an inventory and redirects to its saisie page', function () {
    $this->actingAs($this->stockUser)->post('/dashboard-stock/inventaires', [
        'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id,
        'date' => '2026-07-30',
        'type' => 'general',
        'observation' => 'Inventaire de fin de mois',
    ])->assertRedirect();

    $inventory = Inventory::firstOrFail();
    expect($inventory->status)->toBe('in_progress');
    expect($inventory->reference)->toStartWith('INV-');
    $this->assertDatabaseHas('audit_logs', ['module' => 'Inventaire', 'action' => 'Création']);
});

it('terminates an inventory and persists the computed differences', function () {
    $inventory = Inventory::create([
        'reference' => 'INV-2026-0001', 'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id, 'date' => now()->toDateString(),
        'type' => 'partial', 'status' => 'in_progress',
    ]);

    $this->actingAs($this->stockUser)->patch("/dashboard-stock/inventaires/{$inventory->id}/terminer", [
        'items' => [
            [
                'product_id' => $this->product->id,
                'system_quantity' => 8,
                'physical_quantity' => 12,
                'comment' => 'Caisse retrouvée',
            ],
        ],
    ])->assertRedirect();

    $fresh = $inventory->fresh(['items']);
    expect($fresh->status)->toBe('completed');
    expect($fresh->completed_by)->toBe($this->stockUser->id);
    expect($fresh->items)->toHaveCount(1);
    expect($fresh->items->first()->difference)->toBe(4);
    expect($fresh->items->first()->status)->toBe('petit_ecart');
    $this->assertDatabaseHas('audit_logs', ['module' => 'Inventaire', 'action' => 'Terminaison']);
});

it('blocks editing a completed inventory', function () {
    $inventory = Inventory::create([
        'reference' => 'INV-2026-0002', 'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id, 'date' => now()->toDateString(),
        'type' => 'general', 'status' => 'completed', 'completed_at' => now(),
    ]);

    $this->actingAs($this->stockUser)->put("/dashboard-stock/inventaires/{$inventory->id}", [
        'date' => '2026-08-01', 'type' => 'partial',
    ])->assertSessionHasErrors('inventory');
});

it('serves the inventaires index with stats', function () {
    Inventory::create([
        'reference' => 'INV-2026-0003', 'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id, 'date' => now()->toDateString(),
        'type' => 'general', 'status' => 'completed', 'completed_at' => now(),
    ]);

    $this->actingAs($this->stockUser)->get('/dashboard-stock/inventaires')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Stock/Inventaires/Index')
            ->has('inventories', 1)
            ->has('stats')
            ->has('pagination'));
});

it('exports an inventory as csv', function () {
    $inventory = Inventory::create([
        'reference' => 'INV-2026-0004', 'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id, 'date' => now()->toDateString(),
        'type' => 'general', 'status' => 'completed', 'completed_at' => now(),
    ]);
    $inventory->items()->create([
        'product_id' => $this->product->id, 'system_quantity' => 8,
        'physical_quantity' => 8, 'difference' => 0, 'status' => 'conforme',
    ]);

    $response = $this->actingAs($this->stockUser)->get("/dashboard-stock/inventaires/{$inventory->id}/export/csv")
        ->assertOk()
        ->assertDownload('inventaire_INV-2026-0004.csv');

    $this->assertStringContainsString('Écran inventaire', $response->streamedContent());
});

it('serves only the products of the inventory agency on the saisie page', function () {
    $otherAgency = Agency::create(['name' => 'SUPDATA Marrakech', 'city' => 'Marrakech']);
    Product::create([
        'name' => 'Écran Marrakech', 'reference' => 'INV-TEST-MRK-001', 'category' => 'Informatique',
        'unit_price' => 900, 'quantity_in_stock' => 4, 'reserved_quantity' => 1,
        'minimum_stock' => 2, 'agency_id' => $otherAgency->id, 'status' => 'active',
    ]);
    $inventory = Inventory::create([
        'reference' => 'INV-2026-0005', 'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id, 'date' => now()->toDateString(),
        'type' => 'general', 'status' => 'in_progress',
    ]);

    $this->actingAs($this->stockUser)->get("/dashboard-stock/inventaires/{$inventory->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Stock/Inventaires/Show')
            ->has('products', 1)
            ->where('products.0.id', $this->product->id));
});

it('rejects an item from another agency during saisie', function () {
    $otherAgency = Agency::create(['name' => 'SUPDATA Marrakech', 'city' => 'Marrakech']);
    $otherProduct = Product::create([
        'name' => 'Clavier Marrakech', 'reference' => 'INV-TEST-MRK-002', 'category' => 'Informatique',
        'unit_price' => 200, 'quantity_in_stock' => 10, 'reserved_quantity' => 0,
        'minimum_stock' => 2, 'agency_id' => $otherAgency->id, 'status' => 'active',
    ]);
    $inventory = Inventory::create([
        'reference' => 'INV-2026-0006', 'agency_id' => $this->agency->id,
        'user_id' => $this->stockUser->id, 'date' => now()->toDateString(),
        'type' => 'partial', 'status' => 'in_progress',
    ]);

    $this->actingAs($this->stockUser)->patch("/dashboard-stock/inventaires/{$inventory->id}/terminer", [
        'items' => [
            [
                'product_id' => $otherProduct->id,
                'system_quantity' => 5,
                'physical_quantity' => 5,
            ],
        ],
    ])->assertSessionHasErrors('inventory');

    expect($inventory->fresh()->status)->toBe('in_progress');
    expect($inventory->fresh()->items)->toBeEmpty();
});
