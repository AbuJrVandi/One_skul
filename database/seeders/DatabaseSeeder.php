<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Super Admin
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@oneskul.com',
            'password' => bcrypt('password'),
            'role' => 'super_admin',
            'school_id' => null,
        ]);

        // Districts
        $districts = ['Western Area', 'Bo', 'Kenema', 'Makeni'];
        foreach ($districts as $name) {
            \App\Models\District::create(['name' => $name]);
        }

        // Schools
        $district = \App\Models\District::first();
        \App\Models\School::create([
            'name' => 'Example Public School',
            'district_id' => $district->id,
            'year_founded' => 1990,
            'school_type' => 'government',
            'principal_name' => 'John Doe',
            'is_approved' => true,
        ]);

        \App\Models\School::create([
            'name' => 'Private Excellence School',
            'district_id' => $district->id,
            'year_founded' => 2005,
            'school_type' => 'private',
            'principal_name' => 'Jane Smith',
            'is_approved' => true,
        ]);
        
        \App\Models\School::create([
            'name' => 'Pending School',
            'district_id' => $district->id,
            'year_founded' => 2020,
            'school_type' => 'private',
            'principal_name' => 'Robert Brown',
            'is_approved' => false,
        ]);
    }
}
