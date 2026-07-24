<?php

namespace Database\Seeders;

use App\Models\Agency;
use Illuminate\Database\Seeder;

class AgencySeeder extends Seeder
{
    public function run(): void
    {
        $agencies = [
            [
                'name' => 'SUPDATA Casablanca',
                'city' => 'Casablanca',
                'address' => '123 Boulevard Mohammed V, Casablanca',
                'phone' => '+212 522 123 456',
                'email' => 'casablanca@supdata.com',
                'director' => 'Ahmed Benani',
                'director_email' => 'ahmed.benani@supdata.com',
            ],
            [
                'name' => 'SUPDATA Marrakech',
                'city' => 'Marrakech',
                'address' => '45 Avenue Hassan II, Marrakech',
                'phone' => '+212 524 789 012',
                'email' => 'marrakech@supdata.com',
                'director' => 'Fatima Zahra El Alami',
                'director_email' => 'fatima.elalami@supdata.com',
            ],
        ];

        foreach ($agencies as $agency) {
            Agency::updateOrCreate(
                ['email' => $agency['email']],
                $agency
            );
        }
    }
}