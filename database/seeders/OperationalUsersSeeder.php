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
        $marrakech = Agency::where('city', 'Marrakech')->first();

        if (!$casablanca || !$marrakech) {
            return;
        }

        $accounts = [
            ['role' => 'Gestion Administrative', 'name' => 'Fatima Zahra El Mansouri', 'email' => 'administratif@supdata.ma', 'agency' => $casablanca],
            ['role' => 'Responsable Stock', 'name' => 'Rachid Amrani', 'email' => 'stock@supdata.ma', 'agency' => $casablanca],
            ['role' => 'Administrateur Local', 'name' => 'Youssef Benali', 'email' => 'admin.local@supdata.ma', 'agency' => $casablanca],
            ['role' => 'Responsable Commercial', 'name' => 'Nadia El Amrani', 'email' => 'commercial@supdata.ma', 'agency' => $casablanca],

            ['role' => 'Gestion Administrative', 'name' => 'Khadija Alaoui', 'email' => 'khadija@supdata.ma', 'agency' => $marrakech],
            ['role' => 'Responsable Stock', 'name' => 'Samira Idrissi', 'email' => 'samira@supdata.ma', 'agency' => $marrakech],
            ['role' => 'Administrateur Local', 'name' => 'Ahmed Tazi', 'email' => 'ahmed@supdata.ma', 'agency' => $marrakech],
            ['role' => 'Responsable Commercial', 'name' => 'Omar Fassi', 'email' => 'omar@supdata.ma', 'agency' => $marrakech],
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
                    'agency_id' => $account['agency']->id,
                    'status' => 'active',
                    'must_change_password' => false,
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
