<?php

use App\Models\Agency;
use App\Models\Product;
use App\Models\Role;
use App\Models\StockCategory;
use App\Models\StockOperation;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->casa = Agency::create(['name' => 'Casablanca', 'city' => 'Casablanca']);
    $this->marrakech = Agency::create(['name' => 'Marrakech', 'city' => 'Marrakech']);
    $stockRole = Role::create(['name' => 'Responsable Stock', 'slug' => 'responsable-stock']);
    $this->stockUser = User::factory()->create([
        'agency_id' => $this->casa->id,
        'role_id' => $stockRole->id,
        'name' => 'Alice Stock',
    ]);

    $this->laptop = Product::create([
        'name' => 'Dell Latitude 5540', 'reference' => 'PRD-CASA-001', 'category' => 'Informatique',
        'unit_price' => 1000, 'quantity_in_stock' => 5, 'reserved_quantity' => 0,
        'minimum_stock' => 2, 'agency_id' => $this->casa->id, 'status' => 'active',
    ]);
    $this->chair = Product::create([
        'name' => 'Chaise ergonomique Pro', 'reference' => 'PRD-MRK-002', 'category' => 'Mobilier',
        'unit_price' => 500, 'quantity_in_stock' => 0, 'reserved_quantity' => 0,
        'minimum_stock' => 4, 'agency_id' => $this->marrakech->id, 'status' => 'out_of_stock',
    ]);

    StockOperation::create([
        'reference' => 'MVT-0001', 'section' => 'mouvements', 'name' => 'Dell Latitude 5540',
        'detail' => '+5 unités', 'agency_id' => $this->casa->id, 'product_id' => $this->laptop->id,
        'created_by' => $this->stockUser->id, 'quantity' => 5, 'status' => 'Enregistré',
    ]);

    StockCategory::create(['name' => 'Informatique', 'description' => 'Équipements électroniques', 'active' => true]);
    StockCategory::create(['name' => 'Mobilier', 'description' => null, 'active' => true]);
});

it('filters produits by agence through the query string', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/produits?agency=Marrakech')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Stock/Operations')
            ->has('initialItems', 1)
            ->where('initialItems.0.nom', 'Chaise ergonomique Pro'));
});

it('searches produits by agence name', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/produits?search=Marrakech')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('initialItems', 1)
            ->where('initialItems.0.agence', 'Marrakech'));
});

it('searches produits by name and reference', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/produits?search=PRD-CASA-001')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('initialItems', 1)
            ->where('initialItems.0.nom', 'Dell Latitude 5540'));
});

it('respects perPage and exposes pagination metadata', function () {
    foreach (range(1, 10) as $i) {
        Product::create([
            'name' => "Produit supplémentaire {$i}", 'reference' => "PRD-EXT-{$i}", 'category' => 'Divers',
            'unit_price' => 10, 'quantity_in_stock' => 3, 'reserved_quantity' => 0,
            'minimum_stock' => 1, 'agency_id' => $this->casa->id, 'status' => 'active',
        ]);
    }

    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/produits?perPage=10&page=2')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('initialPagination.perPage', 10)
            ->where('initialPagination.total', 12)
            ->where('initialPagination.totalPages', 2)
            ->where('initialPagination.currentPage', 2)
            ->has('initialItems', 2));
});

it('falls back to 10 when perPage is invalid', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/produits?perPage=42')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('initialPagination.perPage', 10));
});

it('searches categories by description', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/categories?search=électroniques')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('initialItems', 1)
            ->where('initialItems.0.nom', 'Informatique'));
});

it('searches mouvements by product name and creator', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/mouvements?search=Latitude')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('initialItems', 1));

    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/mouvements?search=Alice')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('initialItems', 1));
});

it('searches alertes by product reference', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock/alertes?search=PRD-MRK')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('initialItems', 1)
            ->where('initialItems.0.nom', 'Chaise ergonomique Pro'));
});

it('filters dashboard alerts and receptions by agency from the query string', function () {
    $this->actingAs($this->stockUser)
        ->get('/dashboard-stock?agency=Marrakech')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Stock/Index')
            ->has('dashboardData.alerts', 1)
            ->where('dashboardData.alerts.0.agency', 'Marrakech'));
});
