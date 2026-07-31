<?php

use App\Models\Agency;
use App\Models\CategoryThreshold;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->agency = Agency::create(['name' => 'SUPDATA Casablanca', 'city' => 'Casablanca']);
    $this->role = Role::create(['name' => 'Administrateur Local', 'slug' => 'admin-local']);
    $this->user = User::factory()->create(['agency_id' => $this->agency->id, 'role_id' => $this->role->id]);

    $this->withStoredValues = Product::create([
        'name' => 'Produit avec valeurs', 'reference' => 'STORE-01', 'category' => 'Informatique',
        'unit_price' => 1000, 'quantity_in_stock' => 8, 'reserved_quantity' => 0,
        'minimum_stock' => 3, 'maximum_stock' => 20, 'agency_id' => $this->agency->id, 'status' => 'active',
    ]);
    $this->inheriting = Product::create([
        'name' => 'Produit héritant', 'reference' => 'INHERIT-01', 'category' => 'Informatique',
        'unit_price' => 1000, 'quantity_in_stock' => 8, 'reserved_quantity' => 0,
        'minimum_stock' => 0, 'maximum_stock' => null, 'agency_id' => $this->agency->id, 'status' => 'active',
    ]);

    CategoryThreshold::create([
        'agency_id' => $this->agency->id, 'category' => 'Informatique',
        'minimum_stock' => 18, 'maximum_stock' => 20,
    ]);
});

it('displays effective category thresholds for products without an explicit override', function () {
    $this->actingAs($this->user)
        ->get('/dashboard-admin-local/stock')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/LocalAdmin/Stock/Index')
            ->where('products.0.minimum_stock', 18)
            ->where('products.0.maximum_stock', 20)
            ->where('products.0.threshold_source', 'category')
            ->where('products.1.minimum_stock', 18)
            ->where('products.1.maximum_stock', 20)
            ->where('products.1.threshold_source', 'category')
        );
});

it('propagates a category threshold save to inherited products without writing to products', function () {
    $this->actingAs($this->user)
        ->patch('/dashboard-admin-local/stock/categories/seuils', [
            'product_id' => $this->inheriting->id,
            'minimum_stock' => 12,
            'maximum_stock' => 35,
        ])
        ->assertRedirect();

    $this->actingAs($this->user)
        ->get('/dashboard-admin-local/stock')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/LocalAdmin/Stock/Index')
            ->where('products.0.minimum_stock', 12)
            ->where('products.0.maximum_stock', 35)
            ->where('products.1.minimum_stock', 12)
            ->where('products.1.maximum_stock', 35)
        );

    $this->withStoredValues->refresh();
    expect($this->withStoredValues->minimum_stock)->toBe(3);
    expect($this->withStoredValues->maximum_stock)->toBe(20);
    expect($this->withStoredValues->overrides_threshold)->toBeFalse();
});

it('keeps product values winning once the product thresholds are explicitly saved', function () {
    $this->actingAs($this->user)
        ->patch('/dashboard-admin-local/stock/' . $this->inheriting->id . '/seuils', [
            'product_id' => $this->inheriting->id,
            'minimum_stock' => 5,
            'maximum_stock' => 15,
        ])
        ->assertRedirect();

    $this->inheriting->refresh();
    expect($this->inheriting->overrides_threshold)->toBeTrue();

    $this->actingAs($this->user)
        ->get('/dashboard-admin-local/stock')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/LocalAdmin/Stock/Index')
            ->where('products.1.minimum_stock', 5)
            ->where('products.1.maximum_stock', 15)
            ->where('products.1.threshold_source', 'product')
            ->where('products.0.minimum_stock', 18)
            ->where('products.0.maximum_stock', 20)
            ->where('products.0.threshold_source', 'category')
        );
});
