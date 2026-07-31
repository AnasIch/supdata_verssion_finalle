<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Agency;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $casablanca = Agency::where('name', 'SUPDATA Casablanca')->first();
        $marrakech = Agency::where('name', 'SUPDATA Marrakech')->first();

        if (!$casablanca || !$marrakech) {
            return;
        }

        $products = [
            ['name' => 'Écran Dell 24"', 'reference' => 'ECR-DELL-24', 'category' => 'Informatique', 'unit_price' => 3200.00, 'quantity_in_stock' => 45, 'reserved_quantity' => 3, 'minimum_stock' => 10, 'maximum_stock' => 40, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Clavier sans fil Logitech', 'reference' => 'CLV-LOG-SF', 'category' => 'Périphériques', 'unit_price' => 250.00, 'quantity_in_stock' => 120, 'reserved_quantity' => 5, 'minimum_stock' => 20, 'maximum_stock' => 100, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Souris optique HP', 'reference' => 'SRS-HP-OPT', 'category' => 'Périphériques', 'unit_price' => 150.00, 'quantity_in_stock' => 85, 'reserved_quantity' => 2, 'minimum_stock' => 15, 'maximum_stock' => 100, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Casque audio JBL', 'reference' => 'CSQ-JBL-AUD', 'category' => 'Audio', 'unit_price' => 890.00, 'quantity_in_stock' => 30, 'reserved_quantity' => 0, 'minimum_stock' => 5, 'maximum_stock' => 40, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Imprimante HP LaserJet', 'reference' => 'IMP-HP-LJ', 'category' => 'Imprimerie', 'unit_price' => 4500.00, 'quantity_in_stock' => 12, 'reserved_quantity' => 1, 'minimum_stock' => 3, 'maximum_stock' => 15, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Chaise de bureau Ergo', 'reference' => 'CHS-ERG-BR', 'category' => 'Mobilier', 'unit_price' => 2800.00, 'quantity_in_stock' => 18, 'reserved_quantity' => 0, 'minimum_stock' => 0, 'maximum_stock' => null, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Tableau blanc magnétique', 'reference' => 'TBL-MAG-120', 'category' => 'Mobilier', 'unit_price' => 1200.00, 'quantity_in_stock' => 8, 'reserved_quantity' => 0, 'minimum_stock' => 0, 'maximum_stock' => null, 'agency_id' => $marrakech->id, 'status' => 'active'],
            ['name' => 'Projecteur Epson', 'reference' => 'PRJ-EPSON-X', 'category' => 'Informatique', 'unit_price' => 6500.00, 'quantity_in_stock' => 5, 'reserved_quantity' => 1, 'minimum_stock' => 2, 'maximum_stock' => 6, 'agency_id' => $marrakech->id, 'status' => 'active'],
            ['name' => ' Scanner Canon', 'reference' => 'SCR-CAN-PRO', 'category' => 'Informatique', 'unit_price' => 2100.00, 'quantity_in_stock' => 15, 'reserved_quantity' => 2, 'minimum_stock' => 3, 'maximum_stock' => 20, 'agency_id' => $marrakech->id, 'status' => 'active'],
            ['name' => 'Encre HP Noire', 'reference' => 'ENC-HP-N', 'category' => 'Consommables', 'unit_price' => 180.00, 'quantity_in_stock' => 200, 'reserved_quantity' => 10, 'minimum_stock' => 50, 'maximum_stock' => 150, 'agency_id' => $marrakech->id, 'status' => 'active'],
            ['name' => 'Papier A4 (ramette)', 'reference' => 'PAP-A4-RAM', 'category' => 'Consommables', 'unit_price' => 45.00, 'quantity_in_stock' => 350, 'reserved_quantity' => 20, 'minimum_stock' => 100, 'maximum_stock' => 300, 'agency_id' => $casablanca->id, 'status' => 'active'],
            ['name' => 'Câble HDMI 2m', 'reference' => 'CBL-HDMI-2', 'category' => 'Accessoires', 'unit_price' => 65.00, 'quantity_in_stock' => 0, 'reserved_quantity' => 0, 'minimum_stock' => 20, 'maximum_stock' => null, 'agency_id' => $casablanca->id, 'status' => 'out_of_stock'],
            ['name' => 'Hub USB-C 7-en-1', 'reference' => 'HUB-USBC-7', 'category' => 'Accessoires', 'unit_price' => 420.00, 'quantity_in_stock' => 25, 'reserved_quantity' => 3, 'minimum_stock' => 10, 'maximum_stock' => 30, 'agency_id' => $marrakech->id, 'status' => 'active'],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['reference' => $product['reference']],
                array_merge($product, [
                    'minimum_stock' => 0,
                    'maximum_stock' => null,
                    'overrides_threshold' => false,
                ])
            );
        }
    }
}
