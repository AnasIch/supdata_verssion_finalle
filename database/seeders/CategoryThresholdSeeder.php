<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\CategoryThreshold;
use Illuminate\Database\Seeder;

class CategoryThresholdSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'SUPDATA Casablanca' => [
                'Informatique' => [5, 40],
                'Périphériques' => [15, 100],
                'Audio' => [5, 40],
                'Imprimerie' => [3, 15],
                'Mobilier' => [5, 20],
                'Consommables' => [100, 300],
                'Accessoires' => [20, 50],
            ],
            'SUPDATA Marrakech' => [
                'Mobilier' => [2, 12],
                'Informatique' => [3, 20],
                'Consommables' => [50, 150],
                'Accessoires' => [10, 30],
            ],
        ];

        foreach ($defaults as $agencyName => $categories) {
            $agency = Agency::where('name', $agencyName)->first();

            if (!$agency) {
                continue;
            }

            foreach ($categories as $category => [$minimum, $maximum]) {
                CategoryThreshold::updateOrCreate(
                    ['agency_id' => $agency->id, 'category' => $category],
                    ['minimum_stock' => $minimum, 'maximum_stock' => $maximum],
                );
            }
        }
    }
}
