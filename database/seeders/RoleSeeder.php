<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super-admin', 'description' => 'Administrateur système avec tous les droits'],
            ['name' => 'Administrateur Local', 'slug' => 'admin-local', 'description' => 'Administrateur d\'une agence locale'],
            ['name' => 'Gestion Administrative', 'slug' => 'gestion-administrative', 'description' => 'Gestion des documents et processus administratifs'],
            ['name' => 'Responsable Commercial', 'slug' => 'responsable-commercial', 'description' => 'Gestion des clients, devis et opérations commerciales'],
            ['name' => 'Responsable Stock', 'slug' => 'responsable-stock', 'description' => 'Gestion des stocks, inventaires et mouvements'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}