<?php

namespace Database\Seeders;

use App\Models\Demande;
use App\Models\User;
use App\Models\Agency;
use Illuminate\Database\Seeder;

class DemandeSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@supdata.com')->first();
        $casablanca = Agency::where('name', 'SUPDATA Casablanca')->first();
        $marrakech = Agency::where('name', 'SUPDATA Marrakech')->first();

        if (!$admin || !$casablanca || !$marrakech) {
            return;
        }

        $demandes = [
            ['title' => 'Achat écrans pour salle de réunion', 'description' => 'Remplacement des écrans obsolètes dans la salle de réunion principale', 'user_id' => $admin->id, 'agency_id' => $casablanca->id, 'status' => 'pending', 'priority' => 'high', 'quantity' => 4, 'product_name' => 'Écran Dell 24"', 'estimated_cost' => 12800.00],
            ['title' => 'Commande casques audio', 'description' => 'Casques pour l\'équipe support client', 'user_id' => $admin->id, 'agency_id' => $casablanca->id, 'status' => 'approved', 'priority' => 'medium', 'quantity' => 10, 'product_name' => 'Casque audio JBL', 'estimated_cost' => 8900.00],
            ['title' => 'Fournitures de bureau', 'description' => 'Ravitaillement papier et encre', 'user_id' => $admin->id, 'agency_id' => $marrakech->id, 'status' => 'completed', 'priority' => 'low', 'quantity' => 50, 'product_name' => 'Papier A4 (ramette)', 'estimated_cost' => 2250.00],
            ['title' => 'Projecteur pour formation', 'description' => 'Projecteur portable pour sessions de formation', 'user_id' => $admin->id, 'agency_id' => $marrakech->id, 'status' => 'in_progress', 'priority' => 'high', 'quantity' => 1, 'product_name' => 'Projecteur Epson', 'estimated_cost' => 6500.00],
            ['title' => 'Chaises ergonomiques', 'description' => 'Remplacement chaises usagées open space', 'user_id' => $admin->id, 'agency_id' => $casablanca->id, 'status' => 'pending', 'priority' => 'medium', 'quantity' => 15, 'product_name' => 'Chaise de bureau Ergo', 'estimated_cost' => 42000.00],
            ['title' => 'Câbles et connectique', 'description' => 'Renouvellement câbles HDMI et USB', 'user_id' => $admin->id, 'agency_id' => $casablanca->id, 'status' => 'rejected', 'priority' => 'low', 'quantity' => 30, 'product_name' => 'Câble HDMI 2m', 'estimated_cost' => 1950.00],
            ['title' => 'Hub USB-C pour mobiles', 'description' => 'Adapteurs pour équipe commerciale', 'user_id' => $admin->id, 'agency_id' => $marrakech->id, 'status' => 'pending', 'priority' => 'urgent', 'quantity' => 8, 'product_name' => 'Hub USB-C 7-en-1', 'estimated_cost' => 3360.00],
            ['title' => 'Imprimante supplémentaire', 'description' => 'Imprimante pour le nouveau bureau', 'user_id' => $admin->id, 'agency_id' => $marrakech->id, 'status' => 'approved', 'priority' => 'medium', 'quantity' => 2, 'product_name' => 'Imprimante HP LaserJet', 'estimated_cost' => 9000.00],
        ];

        foreach ($demandes as $demande) {
            Demande::create($demande);
        }
    }
}
