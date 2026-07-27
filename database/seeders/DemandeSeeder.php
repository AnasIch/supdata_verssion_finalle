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
        $rcCb = User::where('email', 'commercial@supdata.ma')->first();
        $rcMk = User::where('email', 'omar@supdata.ma')->first();
        $casablanca = Agency::where('name', 'SUPDATA Casablanca')->first();
        $marrakech = Agency::where('name', 'SUPDATA Marrakech')->first();

        if (!$casablanca || !$marrakech) {
            return;
        }

        $demandes = [];

        if ($rcCb) {
            $demandes = array_merge($demandes, [
                ['title' => 'Achat écrans Dell 24 pouces', 'description' => 'Remplacement des écrans obsolètes dans la salle de réunion', 'user_id' => $rcCb->id, 'agency_id' => $casablanca->id, 'status' => 'submitted', 'priority' => 'high', 'quantity' => 4, 'product_name' => 'Écran Dell 24"'],
                ['title' => 'Claviers sans fil Logitech', 'description' => 'Claviers pour les postes nouveaux', 'user_id' => $rcCb->id, 'agency_id' => $casablanca->id, 'status' => 'submitted', 'priority' => 'medium', 'quantity' => 10, 'product_name' => 'Clavier Logitech MK295'],
                ['title' => 'Imprimante HP LaserJet Pro', 'description' => 'Imprimante pour le service comptabilité', 'user_id' => $rcCb->id, 'agency_id' => $casablanca->id, 'status' => 'pending_local_admin', 'priority' => 'medium', 'quantity' => 2, 'product_name' => 'Imprimante HP LaserJet Pro M404dn'],
                ['title' => 'Switch Cisco 24 ports', 'description' => 'Switch réseau pour nouveau bureau', 'user_id' => $rcCb->id, 'agency_id' => $casablanca->id, 'status' => 'confirmed_local_admin', 'priority' => 'high', 'quantity' => 1, 'product_name' => 'Switch Cisco SG250-24'],
                ['title' => 'Casques audio Bose', 'description' => 'Casques pour centres d\'appels', 'user_id' => $rcCb->id, 'agency_id' => $casablanca->id, 'status' => 'rejected', 'priority' => 'low', 'quantity' => 15, 'product_name' => 'Casque Bose QuietComfort 45'],
            ]);
        }

        if ($rcMk) {
            $demandes = array_merge($demandes, [
                ['title' => 'Fournitures de bureau Q3', 'description' => 'Ravitaillement papier et encre trimestriel', 'user_id' => $rcMk->id, 'agency_id' => $marrakech->id, 'status' => 'submitted', 'priority' => 'low', 'quantity' => 50, 'product_name' => 'Papier A4 (ramette)'],
                ['title' => 'Projecteur pour formation', 'description' => 'Projecteur portable pour sessions de formation', 'user_id' => $rcMk->id, 'agency_id' => $marrakech->id, 'status' => 'pending_local_admin', 'priority' => 'high', 'quantity' => 1, 'product_name' => 'Projecteur Epson EB-X51'],
                ['title' => 'Hub USB-C pour mobiles', 'description' => 'Adapteurs pour équipe commerciale', 'user_id' => $rcMk->id, 'agency_id' => $marrakech->id, 'status' => 'submitted', 'priority' => 'urgent', 'quantity' => 8, 'product_name' => 'Hub USB-C 7-en-1'],
                ['title' => 'Imprimante supplémentaire', 'description' => 'Imprimante pour le nouveau bureau', 'user_id' => $rcMk->id, 'agency_id' => $marrakech->id, 'status' => 'confirmed_local_admin', 'priority' => 'medium', 'quantity' => 2, 'product_name' => 'Imprimante HP LaserJet'],
                ['title' => 'Câbles réseau RJ45', 'description' => 'Renouvellement câbles réseau', 'user_id' => $rcMk->id, 'agency_id' => $marrakech->id, 'status' => 'rejected', 'priority' => 'low', 'quantity' => 30, 'product_name' => 'Câble RJ45 Cat6 3m'],
            ]);
        }

        foreach ($demandes as $demande) {
            Demande::create($demande);
        }
    }
}
