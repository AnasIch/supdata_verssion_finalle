<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Agency;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('slug', 'super-admin')->first();
        $agency = Agency::where('city', 'Casablanca')->first();

        User::updateOrCreate(
            ['email' => 'admin@supdata.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Supdata@2005..'),
                'role_id' => $role->id,
                'agency_id' => $agency->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}
