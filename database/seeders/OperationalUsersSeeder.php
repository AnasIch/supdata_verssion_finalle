<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OperationalUsersSeeder extends Seeder
{
    public function run(): void
    {
        $casablanca = Agency::where('city', 'Casablanca')->first();
        if (!$casablanca) return;

        $accounts = [
            ['role' => 'Gestion Administrative', 'name' => 'Fatima Zahra El Mansouri', 'email' => 'administratif@supdata.ma'],
            ['role' => 'Responsable Stock', 'name' => 'Rachid Amrani', 'email' => 'stock@supdata.ma'],
            ['role' => 'Administrateur Local', 'name' => 'Youssef Benali', 'email' => 'admin.local@supdata.ma'],
            ['role' => 'Responsable Commercial', 'name' => 'Nadia El Amrani', 'email' => 'commercial@supdata.ma'],
        ];

        foreach ($accounts as $account) {
            $role = Role::where('name', $account['role'])->first();
            if (!$role) continue;

            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => Hash::make('Supdata@2026!'),
                    'role_id' => $role->id,
                    'agency_id' => $casablanca->id,
                    'status' => 'active',
                    'must_change_password' => false,
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
